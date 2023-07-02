import { DataDigitaloceanImage } from '@cdktf/provider-digitalocean/lib/data-digitalocean-image';
import { DataDigitaloceanRegion } from '@cdktf/provider-digitalocean/lib/data-digitalocean-region';
import { Droplet } from '@cdktf/provider-digitalocean/lib/droplet';
import { SshKey } from '@cdktf/provider-digitalocean/lib/ssh-key';
import { Vpc } from '@cdktf/provider-digitalocean/lib/vpc';

import { Constructor } from '../../../decorators/constructor';
import { Data } from '../../../decorators/data';
import { Resource } from '../../../decorators/resource';

export class Construct extends Droplet {
  static id = 'mail_droplet';

  @Constructor()
  construct(
    @Resource('vpc') vpc: Vpc,
    @Resource('ssh_key') key: SshKey,
    @Data('region') region: DataDigitaloceanRegion,
    @Data('image') image: DataDigitaloceanImage,
  ): void {
    this.dropletAgent = true;
    this.gracefulShutdown = true;
    this.image = String(image.id);
    this.ipv6 = true;
    this.monitoring = true;
    this.name = 'mail.saifmahmud.name';
    this.resizeDisk = true;
    this.size = 's-1vcpu-2gb';
    this.sshKeys = [key.id];
    this.region = region.slug;
    this.vpcUuid = vpc.id;
  }
}
