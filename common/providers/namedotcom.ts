import { NamedotcomProvider } from '@gen/providers/namedotcom/provider';
import { TerraformStack } from 'cdktf';

export function namedotcomProviderFactory(
  username: string,
  token: string,
  id = 'namedotcom',
): (stack: TerraformStack) => NamedotcomProvider {
  return (stack: TerraformStack) =>
    new NamedotcomProvider(stack, id, {
      username,
      token,
    });
}
