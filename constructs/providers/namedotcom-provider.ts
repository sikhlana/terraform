import {
  NamedotcomProvider as BaseNamedotcomProvider,
  NamedotcomProviderConfig,
} from '@gen/providers/namedotcom/provider';
import { TerraformStack, TerraformVariable } from 'cdktf';

export class NamedotcomProvider extends BaseNamedotcomProvider {
  constructor(
    stack: TerraformStack,
    id: string,
    config?: Partial<NamedotcomProviderConfig>,
  ) {
    super(stack, id, {
      username: new TerraformVariable(stack, 'ndc_username', {
        sensitive: true,
        nullable: false,
      }).value,
      token: new TerraformVariable(stack, 'ndc_token', {
        sensitive: true,
        nullable: false,
      }).value,
      ...config,
    });
  }
}
