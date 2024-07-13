import { Droplet } from '@cdktf/provider-digitalocean/lib/droplet';
import { Firewall } from '@cdktf/provider-digitalocean/lib/firewall';
import { Constructed, Id, Scope, Vars } from '@support/decorators/inject';
import { Token } from 'cdktf';
import { Construct } from 'constructs';

import { Variables } from '../../variables';

export default class extends Firewall {
  constructor(
    @Scope scope: Construct,
    @Id id: string,
    @Constructed('droplet') droplet: Droplet,
    @Vars vars: Variables,
  ) {
    super(scope, id, {
      name: 'tf-web-firewall',
      dropletIds: [droplet.id as unknown as number],
      inboundRule: [
        {
          protocol: 'icmp',
          sourceAddresses: Token.asList(vars.allowedIps.value),
        },
        {
          protocol: 'tcp',
          portRange: '1-65535',
          sourceAddresses: Token.asList(vars.allowedIps.value),
        },
        {
          protocol: 'udp',
          portRange: '1-65535',
          sourceAddresses: Token.asList(vars.allowedIps.value),
        },
        {
          protocol: 'tcp',
          portRange: '80',
          sourceAddresses: ['0.0.0.0/0', '::/0'],
        },
        {
          protocol: 'tcp',
          portRange: '443',
          sourceAddresses: ['0.0.0.0/0', '::/0'],
        },
      ],
      outboundRule: [
        {
          protocol: 'icmp',
          destinationAddresses: ['0.0.0.0/0', '::/0'],
        },
        {
          protocol: 'tcp',
          portRange: '1-65535',
          destinationAddresses: ['0.0.0.0/0', '::/0'],
        },
        {
          protocol: 'udp',
          portRange: '1-65535',
          destinationAddresses: ['0.0.0.0/0', '::/0'],
        },
      ],
    });
  }
}
