import { DataCloudflareZone } from '@cdktf/provider-cloudflare/lib/data-cloudflare-zone';
import { Id, Scope } from '@support/decorators/inject';
import { Construct } from 'constructs';

export default class extends DataCloudflareZone {
  constructor(@Scope scope: Construct, @Id id: string) {
    super(scope, id, {
      name: 'gfnlabs.com',
    });
  }
}
