import { DataDigitaloceanRegion } from '@cdktf/provider-digitalocean/lib/data-digitalocean-region';
import { Vpc } from '@cdktf/provider-digitalocean/lib/vpc';

import { Constructor } from '../../../decorators/constructor';
import { Data } from '../../../decorators/data';
import { Variables } from '../variables';

export class Construct extends Vpc {
  static id = 'vpc';

  @Constructor()
  construct(
    @Data('region') region: DataDigitaloceanRegion,
    vars: Variables,
  ): void {
    this.name = 'tf-vpc';
    this.region = region.slug;
    this.ipRange = vars.vpcCidr.value;
  }
}
