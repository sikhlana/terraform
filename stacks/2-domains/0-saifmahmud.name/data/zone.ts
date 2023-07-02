import { DataCloudflareZone } from '@cdktf/provider-cloudflare/lib/data-cloudflare-zone';

import { SaifMahmudName } from '../stack';

export function construct(stack: SaifMahmudName): DataCloudflareZone {
  return new DataCloudflareZone(stack, 'zone', {
    name: 'saifmahmud.name',
  });
}
