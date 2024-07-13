import { TerraformVariable, VariableType } from 'cdktf';
import { Construct } from 'constructs';

export class Variables extends Construct {
  readonly regionSlug = 'sgp1';

  readonly imageSlug = 'ubuntu-24-04-x64';

  readonly allowedIps = new TerraformVariable(
    this.node.scope as Construct,
    'allowed-ips',
    {
      default: [],
      type: VariableType.list('string'),
    },
  );

  readonly mailVpcCidr = '10.0.0.0/16';

  readonly webVpcCidr = '10.10.0.0/16';
}
