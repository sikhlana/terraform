import {
  App,
  CloudBackend,
  LocalBackend,
  NamedCloudWorkspace,
  TerraformStack,
} from 'cdktf';
import { Construct } from 'constructs';
import 'dotenv/config';
import { existsSync } from 'fs';
import { each, map, snakeCase, sortBy, uniqBy } from 'lodash';
import { join } from 'node:path';
import 'reflect-metadata';
import { Class } from 'type-fest';

import {
  CONSTRUCTOR_METADATA,
  PARAM_DEPS_METADATA,
} from './decorators/constructor';
import {
  PARAM_DATA_METADATA,
  SELF_DECLARED_DATA_METADATA,
} from './decorators/data';
import { PROVIDER_METADATA } from './decorators/provider';
import {
  PARAM_RESOURCES_METADATA,
  SELF_DECLARED_RESOURCES_METADATA,
} from './decorators/resource';
import { SELF_DECLARED_STACKS_METADATA } from './decorators/stack';
import { workspaces } from './decorators/workspace';
import {
  appendRuntimeExtension,
  classes,
  find,
  functions,
  isConstructClass,
  load,
  stackId,
} from './support/functions';

type Container = WeakMap<Class<Construct>, Construct>;

class Main {
  constructor() {
    this.preload();
    const app = new App();
    this.build(app);
    app.synth();
  }

  private preload(): void {
    const files = find(`stacks/**/${appendRuntimeExtension('*')}`);

    for (const file of files) {
      load(file);
    }
  }

  private build(app: App) {
    for (const { cls, stack, path } of this.stacks(app)) {
      const container: Container = new WeakMap();
      container.set(cls, stack);

      this.provider(cls, stack, container);
      this.variables(stack, path, container);

      const data = this.data(stack, path, container);
      this.resources(stack, path, data, container);

      this.outputs(stack, path);
      this.backend(cls, stack, path);
    }
  }

  private *stacks(app: App): IterableIterator<{
    id: string;
    cls: Class<TerraformStack>;
    stack: TerraformStack;
    path: string;
  }> {
    const paths = find('stacks/**/');
    const stacks = new WeakMap();

    for (const path of paths) {
      const file = join(path, appendRuntimeExtension('stack'));

      if (!existsSync(file)) {
        continue;
      }

      if (existsSync(join(path, '.local')) && !process.env.TF_LOCAL) {
        continue;
      }

      for (const cls of classes<TerraformStack>(file)) {
        const id = stackId(cls);
        const stack = new cls(app, id);

        if (Reflect.hasMetadata(SELF_DECLARED_STACKS_METADATA, cls)) {
          for (const { key, stack: value } of Reflect.getMetadata(
            SELF_DECLARED_STACKS_METADATA,
            cls,
          )) {
            Object.defineProperty(stack, key, {
              configurable: false,
              enumerable: false,
              writable: false,
              value: stacks.get(value),
            });
          }
        }

        stacks.set(cls, stack);
        yield { id, cls, stack, path };
      }
    }
  }

  private provider(
    cls: Class<TerraformStack>,
    stack: TerraformStack,
    container: Container,
  ): void {
    if (Reflect.hasMetadata(PROVIDER_METADATA, cls)) {
      for (const { provider, config } of Reflect.getMetadata(
        PROVIDER_METADATA,
        cls,
      )) {
        container.set(
          provider,
          new provider(stack, snakeCase(provider.name), config),
        );
      }
    }
  }

  private variables(
    stack: TerraformStack,
    path: string,
    container: Container,
  ): void {
    const file = join(path, appendRuntimeExtension('variables'));

    if (existsSync(file)) {
      for (const cls of classes<Construct>(file)) {
        container.set(cls, new cls(stack, 'vars'));

        return;
      }
    }
  }

  private data(
    stack: TerraformStack,
    path: string,
    container: Container,
  ): Map<string, Construct> {
    const dir = join(path, 'data');
    const data = new Map();

    if (!existsSync(dir)) {
      return data;
    }

    const files = find(join(dir, appendRuntimeExtension('*')));
    if (files.length === 0) {
      return data;
    }

    for (const file of files) {
      for (const fn of functions<
        (
          stack: TerraformStack,
        ) => Construct[] | Record<string, Construct> | Construct | void
      >(file)) {
        let ret;

        if (isConstructClass(fn)) {
          ret = new fn(stack, fn.id, {});
        } else {
          ret = fn(stack);
        }

        if (ret) {
          if (Construct.isConstruct(ret)) {
            if (Reflect.hasMetadata(CONSTRUCTOR_METADATA, ret.constructor)) {
              const constructor = Reflect.getMetadata(
                CONSTRUCTOR_METADATA,
                ret.constructor,
              );

              let params = [];

              for (const param of Reflect.getMetadata(
                PARAM_DEPS_METADATA,
                ret.constructor,
                constructor,
              ) ?? []) {
                if (container.has(param.type)) {
                  params.push({
                    index: param.index,
                    instance: container.get(param.type),
                  });
                }
              }

              params = sortBy(params, 'index');
              params = map(params, 'instance');

              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ret[constructor](...params);
            }

            ret = [ret];
          }

          if (Array.isArray(ret)) {
            for (const value of ret) {
              data.set(value.node.id, value);
            }
          } else {
            each(ret, (value, key) => {
              data.set(key, value);
            });
          }
        }
      }
    }

    if (Reflect.hasMetadata(SELF_DECLARED_DATA_METADATA, stack.constructor)) {
      for (const { key, id } of Reflect.getMetadata(
        SELF_DECLARED_DATA_METADATA,
        stack.constructor,
      )) {
        Object.defineProperty(stack, key, {
          configurable: false,
          enumerable: false,
          writable: false,
          value: data.get(id),
        });
      }
    }

    return data;
  }

  private resources(
    stack: TerraformStack,
    path: string,
    data: Map<string, Construct>,
    container: Container,
  ) {
    const dir = join(path, 'resources');
    const resources = new Map();

    if (!existsSync(dir)) {
      return;
    }

    const files = find(join(dir, '**', appendRuntimeExtension('*')));
    if (files.length === 0) {
      return;
    }

    for (const file of files) {
      for (const fn of functions<
        (
          stack: TerraformStack,
        ) => Construct[] | Record<string, Construct> | Construct | void
      >(file)) {
        let ret;

        if (isConstructClass(fn)) {
          ret = new fn(stack, fn.id, {});
        } else {
          ret = fn(stack);
        }

        if (ret) {
          if (Construct.isConstruct(ret)) {
            if (Reflect.hasMetadata(CONSTRUCTOR_METADATA, ret.constructor)) {
              const constructor = Reflect.getMetadata(
                CONSTRUCTOR_METADATA,
                ret.constructor,
              );

              let params = [];

              for (const param of Reflect.getMetadata(
                PARAM_RESOURCES_METADATA,
                ret.constructor,
                constructor,
              ) ?? []) {
                if (resources.has(param.id)) {
                  params.push({
                    index: param.index,
                    instance: resources.get(param.id),
                  });
                }
              }

              for (const param of Reflect.getMetadata(
                PARAM_DATA_METADATA,
                ret.constructor,
                constructor,
              ) ?? []) {
                if (data.has(param.id)) {
                  params.push({
                    index: param.index,
                    instance: data.get(param.id),
                  });
                }
              }

              for (const param of Reflect.getMetadata(
                PARAM_DEPS_METADATA,
                ret.constructor,
                constructor,
              ) ?? []) {
                if (container.has(param.type)) {
                  params.push({
                    index: param.index,
                    instance: container.get(param.type),
                  });
                }
              }

              params = sortBy(params, 'index');
              params = uniqBy(params, 'index');
              params = map(params, 'instance');

              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ret[constructor](...params);
            }

            ret = [ret];
          }

          if (Array.isArray(ret)) {
            for (const value of ret) {
              resources.set(value.node.id, value);
            }
          } else {
            each(ret, (value, key) => {
              resources.set(key, value);
            });
          }
        }
      }
    }

    if (
      !Reflect.hasMetadata(SELF_DECLARED_RESOURCES_METADATA, stack.constructor)
    ) {
      return;
    }

    for (const { key, id } of Reflect.getMetadata(
      SELF_DECLARED_RESOURCES_METADATA,
      stack.constructor,
    )) {
      Object.defineProperty(stack, key, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: resources.get(id),
      });
    }
  }

  private outputs(stack: TerraformStack, path: string): void {
    const file = join(path, appendRuntimeExtension('outputs'));

    if (!existsSync(file)) {
      return;
    }

    for (const fn of functions<(stack: TerraformStack) => void>(file)) {
      fn(stack);
    }
  }

  private backend(
    cls: Class<TerraformStack>,
    stack: TerraformStack,
    path: string,
  ): void {
    const file = join(path, appendRuntimeExtension('backend'));

    if (existsSync(file)) {
      for (const fn of functions<(stack: TerraformStack) => void>(file)) {
        fn(stack);

        return;
      }
    }

    if (Reflect.hasMetadata('stack:workspace', cls)) {
      const { workspace } = Reflect.getMetadata('stack:workspace', cls);

      if (workspaces.has(workspace)) {
        new CloudBackend(stack, {
          hostname: 'app.terraform.io',
          organization: process.env.TFC_ORGANIZATION as string,
          workspaces: new NamedCloudWorkspace(workspace),
        });

        return;
      }
    }

    new LocalBackend(stack);
  }
}

new Main();
