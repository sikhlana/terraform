import { DataCloudflareZone } from '@cdktf/provider-cloudflare/lib/data-cloudflare-zone';
import { DomainNameservers } from '@gen/providers/namedotcom/domain-nameservers';

import { Constructor } from '../../../../decorators/constructor';
import { Data } from '../../../../decorators/data';

export class Construct extends DomainNameservers {
  static id = 'nameservers';

  @Constructor()
  construct(@Data('zone') zone: DataCloudflareZone): void {
    this.domainName = 'saifmahmud.name';
    this.nameservers = zone.nameServers;
  }
}
