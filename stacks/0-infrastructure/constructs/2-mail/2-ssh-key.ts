import { SshKey } from '@cdktf/provider-digitalocean/lib/ssh-key';
import { PrivateKey } from '@cdktf/provider-tls/lib/private-key';
import { Constructed, Id, Scope } from '@support/decorators/inject';
import { Construct } from 'constructs';

export default class extends SshKey {
  constructor(
    @Scope scope: Construct,
    @Id id: string,
    @Constructed('private-key') key: PrivateKey,
  ) {
    super(scope, id, {
      name: 'tf-mail-ssh-key',
      publicKey: key.publicKeyOpenssh,
    });
  }
}
