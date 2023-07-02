import { DataDigitaloceanRegion } from '@cdktf/provider-digitalocean/lib/data-digitalocean-region';

import { Constructor } from '../../../decorators/constructor';

export class Construct extends DataDigitaloceanRegion {
  static id = 'region';

  @Constructor()
  construct(): void {
    this.slug = 'sgp1';
  }
}
