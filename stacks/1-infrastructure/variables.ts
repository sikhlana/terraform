import { TerraformVariable, VariableType } from 'cdktf';
import { Construct } from 'constructs';

export class Variables extends Construct {
  readonly vpcCidr = new TerraformVariable(this, 'vpc_cidr', {
    default: '10.0.0.0/16',
  });

  readonly allowedIps = new TerraformVariable(this, 'allowed_ips', {
    default: [],
    type: VariableType.list('string'),
  });
}
