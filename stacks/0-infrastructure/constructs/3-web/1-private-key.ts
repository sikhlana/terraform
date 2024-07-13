import { PrivateKey } from '@cdktf/provider-tls/lib/private-key';
import { Id, Scope } from '@support/decorators/inject';
import { Construct } from 'constructs';

export default class extends PrivateKey {
  constructor(@Scope scope: Construct, @Id id: string) {
    super(scope, id, {
      algorithm: 'ED25519',
    });
  }
}
