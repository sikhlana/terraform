import { PrivateKey } from '@cdktf/provider-tls/lib/private-key';

import { Infrastructure } from '../stack';

export function construct(stack: Infrastructure): PrivateKey {
  return new PrivateKey(stack, 'private_key', {
    algorithm: 'ED25519',
  });
}
