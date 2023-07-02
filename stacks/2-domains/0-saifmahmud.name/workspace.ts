import { Variable } from '@cdktf/provider-tfe/lib/variable';
import { Workspace } from '@cdktf/provider-tfe/lib/workspace';

export function construct(workspace: Workspace): void {
  new Variable(workspace, 'ndc_username', {
    category: 'terraform',
    key: 'ndc_username',
    value: process.env.NDC_USERNAME,
    sensitive: true,
    workspaceId: workspace.id,
  });

  new Variable(workspace, 'ndc_token', {
    category: 'terraform',
    key: 'ndc_token',
    value: process.env.NDC_TOKEN,
    sensitive: true,
    workspaceId: workspace.id,
  });

  new Variable(workspace, 'cf_api_token', {
    category: 'terraform',
    key: 'cf_api_token',
    value: process.env.CF_API_TOKEN,
    sensitive: true,
    workspaceId: workspace.id,
  });
}
