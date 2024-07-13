import { Constructed, Id, Scope } from '@support/decorators/inject';
import { TerraformStack } from 'cdktf';
import { Construct } from 'constructs';

import { Mail } from './constructs/2-mail';
import { Web } from './constructs/3-web';

export class Infrastructure extends TerraformStack {
  constructor(
    @Scope scope: Construct,
    @Id id: string,
    @Constructed(Mail) public readonly mail: Mail,
    @Constructed(Web) public readonly web: Web,
  ) {
    super(scope, id);
  }
}
