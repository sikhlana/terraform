import { DataCloudflareZone } from '@cdktf/provider-cloudflare/lib/data-cloudflare-zone';
import { DomainNameservers } from '@gen/providers/namedotcom/domain-nameservers';
import { Constructed, Id, Scope } from '@support/decorators/inject';
import { Construct } from 'constructs';

export default class extends DomainNameservers {
  constructor(
    @Scope scope: Construct,
    @Id id: string,
    @Constructed('zone') zone: DataCloudflareZone,
  ) {
    super(scope, id, {
      domainName: 'saifmahmud.name',
      nameservers: zone.nameServers,
    });
  }
}
