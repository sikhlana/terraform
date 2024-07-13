import { DataCloudflareZone } from '@cdktf/provider-cloudflare/lib/data-cloudflare-zone';
import { Record } from '@cdktf/provider-cloudflare/lib/record';
import { Zone } from '@cdktf/provider-cloudflare/lib/zone';
import { Construct } from 'constructs';

export function constructCloudflareAddressRecord(
  scope: Construct,
  zone: Zone | DataCloudflareZone,
  name: string,
  withWww: boolean,
  ipv4Address: string,
  ipv6Address?: string,
): void {
  new (class extends Construct {
    constructor(scope: Construct, id: string) {
      super(scope, id);

      new Record(this, 'a', {
        zoneId: zone.id,
        name,
        type: 'A',
        allowOverwrite: true,
        ttl: 300,
        value: ipv4Address,
      });

      if (ipv6Address) {
        new Record(this, 'aaaa', {
          zoneId: zone.id,
          name,
          type: 'AAAA',
          allowOverwrite: true,
          ttl: 300,
          value: ipv6Address,
        });
      }
    }
  })(scope, 'apex');

  if (withWww) {
    new (class extends Construct {
      constructor(scope: Construct, id: string) {
        super(scope, id);

        new Record(this, 'a', {
          zoneId: zone.id,
          name: `www.${name}`,
          type: 'A',
          allowOverwrite: true,
          ttl: 300,
          value: ipv4Address,
        });

        if (ipv6Address) {
          new Record(this, 'aaaa', {
            zoneId: zone.id,
            name: `www.${name}`,
            type: 'AAAA',
            allowOverwrite: true,
            ttl: 300,
            value: ipv6Address,
          });
        }
      }
    })(scope, 'www');
  }
}
