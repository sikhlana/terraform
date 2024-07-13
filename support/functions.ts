import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

import { NoWorkspaceDefinedError } from '@support/errors';
import { PARENT_SCOPE, SCOPE_ID } from '@support/symbols';
import { TerraformStack } from 'cdktf';
import { Construct } from 'constructs';
import { compile, Data, TemplateFunction } from 'ejs';
import * as getCallerFile from 'get-caller-file';
import { globSync } from 'glob';
import { orderBy } from 'natural-orderby';
import { DependencyContainer, injectable } from 'tsyringe';
import { Class } from 'type-fest';

export function files(pattern: string): string[] {
  return orderBy(
    globSync(pattern, {
      absolute: true,
      cwd: process.env.BASE_DIRECTORY,
      dot: false,
      follow: false,
    }),
  );
}

export function* loadFunctions<TFunction extends Function = Function>(
  file: string,
): Generator<TFunction> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  for (const fn of Object.values<TFunction>(require(file))) {
    if (typeof fn !== 'function') {
      continue;
    }

    yield fn;
  }
}

export function* loadConstructs(file: string): Generator<Class<Construct>> {
  for (const cls of loadFunctions<Class<Construct>>(file)) {
    if (!Construct.isConstruct(cls.prototype)) {
      continue;
    }

    yield cls;
  }
}

export function resolve<TConstruct extends Construct>(
  container: DependencyContainer,
  cls: unknown,
): TConstruct {
  const decorated = Reflect.decorate(
    [injectable() as ClassDecorator],
    cls as Class<TConstruct>,
  );

  return container.resolve(decorated as Class<TConstruct>);
}

export async function buildConstructs(
  directory: string,
  baseContainer: DependencyContainer,
  container: DependencyContainer,
  scope: Construct,
  prefix: string,
): Promise<void> {
  for (const file of files(join(directory, '*'))) {
    if (basename(file).startsWith('.')) {
      continue;
    }

    const constructId = basename(file).split('.ts')[0].replace(/^\d+-/, '');
    const childContainer = container.createChildContainer();

    try {
      childContainer.registerInstance(PARENT_SCOPE, scope);
      childContainer.register(SCOPE_ID, { useValue: constructId });

      if (lstatSync(file).isDirectory()) {
        let instance: Construct | undefined;

        if (existsSync(join(file, 'index.ts'))) {
          for (const cls of loadConstructs(join(file, 'index.ts'))) {
            instance = resolve(childContainer, cls);
            baseContainer.registerInstance(cls, instance);

            break;
          }
        }

        if (!instance) {
          instance = new Construct(scope, constructId);
        }

        baseContainer.registerInstance(
          `construct:${prefix}${constructId}`,
          instance,
        );

        container.registerInstance(`construct:${constructId}`, instance);

        await buildConstructs(
          file,
          baseContainer,
          childContainer,
          instance,
          `${prefix}${constructId}/`,
        );
      } else {
        if (basename(file) === 'index.ts') {
          continue;
        }

        for (const cls of loadConstructs(file)) {
          const instance = resolve(childContainer, cls);
          baseContainer.registerInstance(cls, instance);

          baseContainer.registerInstance(
            `construct:${prefix}${constructId}`,
            instance,
          );

          container.registerInstance(`construct:${constructId}`, instance);
        }
      }
    } finally {
      await childContainer.dispose();
    }
  }
}

export function workspaceNameAndProject(
  stack: TerraformStack,
): [string, string | undefined] {
  if (!Reflect.hasMetadata('tfe:workspace', stack.constructor)) {
    throw new NoWorkspaceDefinedError(
      `Workspace metadata is not defined for the stack ${stack.constructor.name}`,
    );
  }

  return Reflect.getMetadata('tfe:workspace', stack);
}

const compiledTemplates = new Map<string, TemplateFunction>();

export function loadTemplate<TData extends Data>(
  filename: string,
  data?: TData,
  directory?: string,
): string {
  const pieces = (directory ?? dirname(getCallerFile()))
    .substring((process.env.BASE_DIRECTORY as string).length + 1)
    .split('/');

  do {
    const path = join(
      process.env.BASE_DIRECTORY as string,
      ...pieces,
      '.templates',
    );

    let file = join(path, `${filename}.ejs`);
    if (existsSync(file)) {
      if (!compiledTemplates.has(file)) {
        compiledTemplates.set(
          file,
          compile(readFileSync(file, { encoding: 'utf-8' }), {
            async: false,
            client: false,
            escape: (d) => d,
          }),
        );
      }

      return (compiledTemplates.get(file) as TemplateFunction)(data);
    }

    file = join(path, filename);
    if (existsSync(file)) {
      return readFileSync(file, { encoding: 'utf-8' });
    }

    pieces.pop();
  } while (pieces.length > 0);

  return '';
}
