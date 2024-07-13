import { DataDigitaloceanImage } from '@cdktf/provider-digitalocean/lib/data-digitalocean-image';
import { DataDigitaloceanRegion } from '@cdktf/provider-digitalocean/lib/data-digitalocean-region';
import { Droplet } from '@cdktf/provider-digitalocean/lib/droplet';
import { SshKey } from '@cdktf/provider-digitalocean/lib/ssh-key';
import { Vpc } from '@cdktf/provider-digitalocean/lib/vpc';
import { Constructed, Id, Scope } from '@support/decorators/inject';

import { Mail } from './index';

export default class extends Droplet {
  constructor(
    @Scope scope: Mail,
    @Id id: string,
    @Constructed('/region') region: DataDigitaloceanRegion,
    @Constructed('/image') image: DataDigitaloceanImage,
    @Constructed('vpc') vpc: Vpc,
    @Constructed('ssh-key') key: SshKey,
  ) {
    super(scope, id, {
      dropletAgent: true,
      gracefulShutdown: true,
      image: image.slug,
      ipv6: true,
      monitoring: true,
      name: 'mail.saifmahmud.name',
      resizeDisk: true,
      size: 's-1vcpu-2gb',
      sshKeys: [key.id],
      region: region.slug,
      vpcUuid: vpc.id,
    });

    scope.droplet = this;
  }
}
