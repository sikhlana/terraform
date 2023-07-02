import { DataCloudflareZone } from '@cdktf/provider-cloudflare/lib/data-cloudflare-zone';
import { Record } from '@cdktf/provider-cloudflare/lib/record';
import { Construct } from 'constructs';

import { Constructor } from '../../../../decorators/constructor';
import { Data } from '../../../../decorators/data';
import { SaifMahmudName } from '../stack';

export class Mail extends Construct {
  static id = 'mail_record';

  @Constructor()
  construct(
    stack: SaifMahmudName,
    @Data('zone') zone: DataCloudflareZone,
  ): void {
    new Record(this, 'a', {
      allowOverwrite: true,
      name: 'mail',
      proxied: false,
      type: 'A',
      value: stack.infrastructure.mailDroplet.ipv4Address,
      zoneId: zone.id,
    });

    new Record(this, 'aaaa', {
      allowOverwrite: true,
      name: 'mail',
      proxied: false,
      type: 'AAAA',
      value: stack.infrastructure.mailDroplet.ipv6Address,
      zoneId: zone.id,
    });
  }
}
