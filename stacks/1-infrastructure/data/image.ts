import { DataDigitaloceanImage } from '@cdktf/provider-digitalocean/lib/data-digitalocean-image';

import { Infrastructure } from '../stack';

export function construct(stack: Infrastructure): DataDigitaloceanImage {
  return new DataDigitaloceanImage(stack, 'image', {
    slug: 'ubuntu-22-04-x64',
  });
}
