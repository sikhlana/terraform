import { DataDigitaloceanImage } from '@cdktf/provider-digitalocean/lib/data-digitalocean-image';
import { Id, Scope, Vars } from '@support/decorators/inject';
import { Construct } from 'constructs';

import { Variables } from '../variables';

export default class extends DataDigitaloceanImage {
  constructor(@Scope scope: Construct, @Id id: string, @Vars vars: Variables) {
    super(scope, id, {
      slug: vars.imageSlug,
    });
  }
}
