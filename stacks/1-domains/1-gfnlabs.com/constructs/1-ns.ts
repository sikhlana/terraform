import { DataCloudflareZone } from '@cdktf/provider-cloudflare/lib/data-cloudflare-zone';
import { DomainRecords } from '@gen/providers/namecheap/domain-records';
import { Constructed, Id, Scope } from '@support/decorators/inject';
import { Construct } from 'constructs';

export default class extends DomainRecords {
  constructor(
    @Scope scope: Construct,
    @Id id: string,
    @Constructed('zone') zone: DataCloudflareZone,
  ) {
    super(scope, id, {
      domain: 'gfnlabs.com',
      mode: 'OVERWRITE',
      nameservers: zone.nameServers,
    });
  }
}
