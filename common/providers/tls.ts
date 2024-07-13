import { TlsProvider } from '@cdktf/provider-tls/lib/provider';
import { TerraformStack } from 'cdktf';

export function createTlsProvider(stack: TerraformStack): TlsProvider {
  return new TlsProvider(stack, 'tls');
}
