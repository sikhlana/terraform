import { Project } from '@cdktf/provider-tfe/lib/project';
import { Workspace } from '@cdktf/provider-tfe/lib/workspace';
import { existsSync } from 'fs';
import { omit, snakeCase } from 'lodash';
import { join } from 'node:path';

import { workspaces } from '../../../decorators/workspace';
import { appendRuntimeExtension, functions } from '../../../support/functions';
import { TerraformCloud } from '../stack';

export function construct(stack: TerraformCloud): void {
  const projects = new Map<string, Project>();

  // eslint-disable-next-line prefer-const
  for (let [name, { directory, config }] of workspaces.entries()) {
    if (config.project) {
      if (!projects.has(config.project)) {
        projects.set(
          config.project,
          new Project(stack, `project_${snakeCase(config.project)}`, {
            name: config.project,
          }),
        );
      }

      config = {
        ...omit(config, 'project'),
        projectId: projects.get(config.project)?.id,
      };
    }

    const workspace = new Workspace(stack, snakeCase(name), {
      allowDestroyPlan: true,
      autoApply: true,
      executionMode: 'remote',
      globalRemoteState: true,
      ...config,
      name,
    });

    const file = join(directory, appendRuntimeExtension('workspace'));

    if (existsSync(file)) {
      for (const fn of functions(file)) {
        fn(workspace);
      }
    }
  }
}
