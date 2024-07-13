import { DataCloudflareZone } from '@cdktf/provider-cloudflare/lib/data-cloudflare-zone';
import { constructCloudflareAddressRecord } from '@common/cloudflare/dns';
import { Infrastructure } from '@stacks/0-infrastructure/stack';
import { Constructed, Id, Scope } from '@support/decorators/inject';
import { Construct } from 'constructs';

export default class extends Construct {
  constructor(
    @Scope scope: Construct,
    @Id id: string,
    @Constructed('zone') zone: DataCloudflareZone,
    @Constructed(Infrastructure) infra: Infrastructure,
  ) {
    super(scope, id);

    constructCloudflareAddressRecord(
      this,
      zone,
      'mail',
      false,
      infra.mail.droplet.ipv4Address,
      infra.mail.droplet.ipv6Address,
    );
  }
}
