import { Droplet } from '@cdktf/provider-digitalocean/lib/droplet';
import { TlsProvider } from '@cdktf/provider-tls/lib/provider';
import { TerraformStack } from 'cdktf';

import { DigitaloceanProvider } from '../../constructs/providers/digitalocean-provider';
import { Provider } from '../../decorators/provider';
import { Resource } from '../../decorators/resource';
import { Workspace } from '../../decorators/workspace';

@Workspace('infrastructure')
@Provider(DigitaloceanProvider)
@Provider(TlsProvider)
export class Infrastructure extends TerraformStack {
  @Resource('mail_droplet')
  readonly mailDroplet: Droplet;
}
