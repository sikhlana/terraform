import { Variable } from '@cdktf/provider-tfe/lib/variable';
import { Workspace } from '@cdktf/provider-tfe/lib/workspace';

export function construct(workspace: Workspace): void {
  new Variable(workspace, 'digitalocean_token', {
    category: 'terraform',
    key: 'digitalocean_token',
    value: process.env.DO_TOKEN,
    sensitive: true,
    workspaceId: workspace.id,
  });
}
