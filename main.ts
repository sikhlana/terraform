import 'reflect-metadata';
import './env';

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { buildTerraformCloudStack } from '@support/cloud';
import {
  buildConstructs,
  files,
  loadConstructs,
  loadFunctions,
  resolve,
  workspaceNameAndProject,
} from '@support/functions';
import {
  CURRENT_STACK,
  PARENT_SCOPE,
  SCOPE_ID,
  STACK_VARIABLES,
} from '@support/symbols';
import { StackDetails } from '@support/types';
import {
  App,
  CloudBackend,
  LocalBackend,
  NamedCloudWorkspace,
  TerraformProvider,
  TerraformStack,
} from 'cdktf';
import { Construct } from 'constructs';
// @ts-expect-error typescript files dont exist...
import * as printTree from 'print-tree';
import { kebabCase } from 'scule';
import { container } from 'tsyringe';

process.env.BASE_DIRECTORY = __dirname;

async function main(app: App): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv-expand').expand(require('dotenv').config());

  const stacks = new Map<string, StackDetails>();

  for (const file of files('stacks/**/stack.ts')) {
    const dir = dirname(file);
    const childContainer = container.createChildContainer();

    for (const cls of loadConstructs(file)) {
      const stackId = kebabCase(cls.name);

      childContainer.registerInstance(PARENT_SCOPE, app);
      childContainer.register(SCOPE_ID, { useValue: stackId });

      const instance = resolve(childContainer, cls) as TerraformStack;

      const details: StackDetails = {
        path: dir,
        stack: instance,
      };

      container.registerInstance(`stack:${stackId}`, instance);
      container.registerInstance(cls, instance);

      childContainer.registerInstance(CURRENT_STACK, instance);

      if (existsSync(join(dir, 'variables.ts'))) {
        for (const cls of loadConstructs(join(dir, 'variables.ts'))) {
          const vars = new cls(instance, 'vars');

          childContainer.registerInstance(cls, vars);
          childContainer.registerInstance(STACK_VARIABLES, vars);

          break;
        }
      }

      if (existsSync(join(dir, 'provider.ts'))) {
        for (const fn of loadFunctions<
          (stack: TerraformStack) => TerraformProvider
        >(join(dir, 'provider.ts'))) {
          const provider = fn(instance);
          childContainer.registerInstance(
            `provider:${provider.node.id}`,
            provider,
          );
        }
      }

      await buildConstructs(
        join(dir, 'constructs'),
        childContainer,
        childContainer,
        instance,
        '/',
      );

      if (existsSync(join(dir, 'backend.ts'))) {
        details.backend = {
          functions: loadFunctions(join(dir, 'backend.ts')),
        };
      }

      if (Reflect.hasMetadata('tfe:workspace', instance.constructor)) {
        details.workspace = {
          functions: existsSync(join(dir, 'workspace.ts'))
            ? loadFunctions(join(dir, 'workspace.ts'))
            : [],
        };
      }

      stacks.set(stackId, details);
      break;
    }

    // await childContainer.dispose();
  }

  let buildTfCloudStack = false;

  for (const [_, details] of stacks.entries()) {
    if (details.backend) {
      for (const fn of details.backend.functions) {
        fn(details.stack);
        break;
      }

      continue;
    }

    if (details.workspace && process.env.TFE_ORGANIZATION) {
      const [name, project] = workspaceNameAndProject(details.stack);

      new CloudBackend(details.stack, {
        organization: process.env.TFE_ORGANIZATION,
        workspaces: new NamedCloudWorkspace(`${name}-${project}`, project),
      });

      buildTfCloudStack = true;
      continue;
    }

    new LocalBackend(details.stack);
  }

  if (buildTfCloudStack) {
    buildTerraformCloudStack(app, stacks);
  }
}

(async (app: App) => {
  await main(app);
  return app;
})(new App()).then((app) => {
  if (process.env.CDKTF_OUTDIR) {
    app.synth();
  } else {
    printTree(
      app,
      (scope: Construct) => {
        let name = scope.constructor.name;

        if (!name || name.startsWith('default_')) {
          name = Object.getPrototypeOf(scope.constructor).name;
        }

        return `${scope.node.id} (${name})`.trim();
      },
      // @ts-expect-error just trying to hijack...
      (scope: Construct) => Object.values(scope.node._children),
    );
  }
});
