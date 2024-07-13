import { DataDigitaloceanRegion } from '@cdktf/provider-digitalocean/lib/data-digitalocean-region';
import { Id, Scope, Vars } from '@support/decorators/inject';
import { Construct } from 'constructs';

import { Variables } from '../variables';

export default class extends DataDigitaloceanRegion {
  constructor(@Scope scope: Construct, @Id id: string, @Vars vars: Variables) {
    super(scope, id, {
      slug: vars.regionSlug,
    });
  }
}
