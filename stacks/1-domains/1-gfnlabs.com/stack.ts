import { Id, Scope } from '@support/decorators/inject';
import { TerraformStack } from 'cdktf';
import { Construct } from 'constructs';

export class GfnlabsCom extends TerraformStack {
  constructor(@Scope scope: Construct, @Id id: string) {
    super(scope, id);
  }
}
