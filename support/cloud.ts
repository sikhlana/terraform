import { Project } from '@cdktf/provider-tfe/lib/project';
import { TfeProvider } from '@cdktf/provider-tfe/lib/provider';
import { Workspace } from '@cdktf/provider-tfe/lib/workspace';
import { WorkspaceSettings } from '@cdktf/provider-tfe/lib/workspace-settings';
import { workspaceNameAndProject } from '@support/functions';
import { StackDetails } from '@support/types';
import { App, CloudBackend, NamedCloudWorkspace, TerraformStack } from 'cdktf';
import { kebabCase } from 'scule';

export function buildTerraformCloudStack(
  app: App,
  stacks: Map<string, StackDetails>,
): void {
  new (class extends TerraformStack {
    constructor() {
      super(app, 'tf-cloud');

      new CloudBackend(this, {
        organization: process.env.TFE_ORGANIZATION,
        workspaces: new NamedCloudWorkspace('tf-cloud'),
      });

      new TfeProvider(this, 'tfe', {
        organization: process.env.TFE_ORGANIZATION,
      });

      const projects = new Map<string, Project>();
      const workspaceNames = new Map<string, number>();

      for (const [_, details] of stacks.entries()) {
        if (!details.workspace) {
          continue;
        }

        const [name, project] = workspaceNameAndProject(details.stack);

        if (project && !projects.has(project)) {
          projects.set(
            project,
            new Project(this, `project_${kebabCase(project)}`, {
              name: project,
            }),
          );
        }

        let workspaceId = kebabCase(name);

        if (workspaceNames.has(name)) {
          workspaceId += `_${workspaceNames.get(name)}`;
        }

        workspaceNames.set(name, (workspaceNames.get(name) ?? 0) + 1);

        const workspace = new Workspace(this, `workspace_${workspaceId}`, {
          name: `${name}-${project}`,
          allowDestroyPlan: true,
          autoApply: true,
          globalRemoteState: true,
          projectId: project ? projects.get(project)?.id : undefined,
        });

        for (const fn of details.workspace.functions) {
          fn(workspace);
        }

        new WorkspaceSettings(workspace, 'settings', {
          executionMode: 'remote',
          workspaceId: workspace.id,
        });
      }
    }
  })();
}
