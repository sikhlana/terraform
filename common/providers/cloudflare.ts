import { CloudflareProvider } from '@cdktf/provider-cloudflare/lib/provider';
import { TerraformStack } from 'cdktf';

export function cloudflareProviderFactory(
  apiToken: string,
  id = 'cloudflare',
): (stack: TerraformStack) => CloudflareProvider {
  return (stack: TerraformStack) =>
    new CloudflareProvider(stack, id, {
      apiToken,
    });
}
