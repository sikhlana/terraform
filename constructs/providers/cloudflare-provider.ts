import {
  CloudflareProvider as BaseCloudflareProvider,
  CloudflareProviderConfig,
} from '@cdktf/provider-cloudflare/lib/provider';
import { TerraformStack, TerraformVariable } from 'cdktf';

export class CloudflareProvider extends BaseCloudflareProvider {
  constructor(
    stack: TerraformStack,
    id: string,
    config?: Partial<CloudflareProviderConfig>,
  ) {
    super(stack, id, {
      apiToken: new TerraformVariable(stack, 'cf_api_token', {
        nullable: false,
        sensitive: true,
      }).value,
      ...config,
    });
  }
}
