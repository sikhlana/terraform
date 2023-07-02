import { WorkspaceConfig } from '@cdktf/provider-tfe/lib/workspace';
import * as getCallerFile from 'get-caller-file';
import { dirname } from 'node:path';
import { Except } from 'type-fest';

export const workspaces = new Map<
  string,
  {
    directory: string;
    config: Except<WorkspaceConfig, 'name'> & { project?: string };
  }
>();

export function Workspace(
  workspace: string,
  config: Except<WorkspaceConfig, 'name'> & { project?: string } = {},
): ClassDecorator {
  workspaces.set(workspace, { directory: dirname(getCallerFile()), config });

  return (target) => {
    Reflect.defineMetadata(
      'stack:workspace',
      {
        workspace,
      },
      target,
    );
  };
}
