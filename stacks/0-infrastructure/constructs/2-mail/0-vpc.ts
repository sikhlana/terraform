import { DataDigitaloceanRegion } from '@cdktf/provider-digitalocean/lib/data-digitalocean-region';
import { Vpc } from '@cdktf/provider-digitalocean/lib/vpc';
import { Constructed, Id, Scope, Vars } from '@support/decorators/inject';
import { Construct } from 'constructs';

import { Variables } from '../../variables';

export default class extends Vpc {
  constructor(
    @Scope scope: Construct,
    @Id id: string,
    @Constructed('/region') region: DataDigitaloceanRegion,
    @Vars vars: Variables,
  ) {
    super(scope, id, {
      name: 'tf-mail-vpc',
      region: region.slug,
      ipRange: vars.mailVpcCidr,
    });
  }
}
