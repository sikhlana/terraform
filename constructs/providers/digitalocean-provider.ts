import {
  DigitaloceanProvider as BaseDigitaloceanProvider,
  DigitaloceanProviderConfig,
} from '@cdktf/provider-digitalocean/lib/provider';
import { TerraformStack, TerraformVariable } from 'cdktf';

export class DigitaloceanProvider extends BaseDigitaloceanProvider {
  constructor(
    stack: TerraformStack,
    id: string,
    config?: DigitaloceanProviderConfig,
  ) {
    super(stack, id, {
      token: new TerraformVariable(stack, 'digitalocean_token', {
        sensitive: true,
        nullable: false,
      }).value,
      ...config,
    });
  }
}
