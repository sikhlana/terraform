import { TfeProvider } from '@cdktf/provider-tfe/lib/provider';
import { TerraformStack } from 'cdktf';

import { Provider } from '../../decorators/provider';
import { Workspace } from '../../decorators/workspace';

@Workspace('terraform-cloud', {
  executionMode: 'local',
  globalRemoteState: false,
})
@Provider(TfeProvider, {
  organization: process.env.TFC_ORGANIZATION,
})
export class TerraformCloud extends TerraformStack {}
