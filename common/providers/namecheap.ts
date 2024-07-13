import { NamecheapProvider } from '@gen/providers/namecheap/provider';
import { TerraformStack } from 'cdktf';

export function namecheapProviderFactory(
  userName: string,
  apiUser: string,
  apiKey: string,
  id = 'namecheap',
): (stack: TerraformStack) => NamecheapProvider {
  return (stack: TerraformStack) =>
    new NamecheapProvider(stack, id, {
      userName,
      apiUser,
      apiKey,
    });
}
