import { TerraformStack } from 'cdktf';

import { Infrastructure } from '../../1-infrastructure/stack';
import { CloudflareProvider } from '../../../constructs/providers/cloudflare-provider';
import { NamedotcomProvider } from '../../../constructs/providers/namedotcom-provider';
import { Provider } from '../../../decorators/provider';
import { Stack } from '../../../decorators/stack';
import { Workspace } from '../../../decorators/workspace';

@Workspace('name-saifmahmud', { project: 'Domains' })
@Provider(CloudflareProvider)
@Provider(NamedotcomProvider)
export class SaifMahmudName extends TerraformStack {
  @Stack()
  readonly infrastructure: Infrastructure;
}
