import { SshKey } from '@cdktf/provider-digitalocean/lib/ssh-key';
import { PrivateKey } from '@cdktf/provider-tls/lib/private-key';

import { Constructor } from '../../../decorators/constructor';
import { Resource } from '../../../decorators/resource';

export class Construct extends SshKey {
  static id = 'ssh_key';

  @Constructor()
  construct(@Resource('private_key') privateKey: PrivateKey): void {
    this.name = 'tf-ssh-key';
    this.publicKey = privateKey.publicKeyOpenssh;
  }
}
