import { DigitaloceanProvider } from '@cdktf/provider-digitalocean/lib/provider';
import { TerraformStack } from 'cdktf';

export function digitaloceanProviderFactory(
  token: string,
  id = 'digitalocean',
): (stack: TerraformStack) => DigitaloceanProvider {
  return (stack: TerraformStack) =>
    new DigitaloceanProvider(stack, id, {
      token,
    });
}
