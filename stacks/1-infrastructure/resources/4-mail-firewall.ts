import { Droplet } from '@cdktf/provider-digitalocean/lib/droplet';
import { Firewall } from '@cdktf/provider-digitalocean/lib/firewall';
import { Token } from 'cdktf';

import { Constructor } from '../../../decorators/constructor';
import { Resource } from '../../../decorators/resource';
import { Variables } from '../variables';

export class Construct extends Firewall {
  static id = 'mail_firewall';

  @Constructor()
  construct(@Resource('mail_droplet') droplet: Droplet, vars: Variables): void {
    this.name = 'tf-mail-firewall';

    this.putInboundRule([
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
        portRange: '25',
        sourceAddresses: ['0.0.0.0/0', '::/0'],
      },
      {
        protocol: 'tcp',
        portRange: '80',
        sourceAddresses: ['0.0.0.0/0', '::/0'],
      },
      {
        protocol: 'tcp',
        portRange: '110',
        sourceAddresses: ['0.0.0.0/0', '::/0'],
      },
      {
        protocol: 'tcp',
        portRange: '143',
        sourceAddresses: ['0.0.0.0/0', '::/0'],
      },
      {
        protocol: 'tcp',
        portRange: '443',
        sourceAddresses: ['0.0.0.0/0', '::/0'],
      },
      {
        protocol: 'tcp',
        portRange: '465',
        sourceAddresses: ['0.0.0.0/0', '::/0'],
      },
      {
        protocol: 'tcp',
        portRange: '587',
        sourceAddresses: ['0.0.0.0/0', '::/0'],
      },
      {
        protocol: 'tcp',
        portRange: '993',
        sourceAddresses: ['0.0.0.0/0', '::/0'],
      },
      {
        protocol: 'tcp',
        portRange: '995',
        sourceAddresses: ['0.0.0.0/0', '::/0'],
      },
      {
        protocol: 'tcp',
        portRange: '4190',
        sourceAddresses: ['0.0.0.0/0', '::/0'],
      },
    ]);

    this.putOutboundRule([
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
    ]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.dropletIds = [droplet.id];
  }
}
