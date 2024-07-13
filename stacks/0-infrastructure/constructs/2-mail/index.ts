import { Droplet } from '@cdktf/provider-digitalocean/lib/droplet';
import { Id, Scope } from '@support/decorators/inject';
import { Construct } from 'constructs';

export class Mail extends Construct {
  public droplet: Droplet;

  constructor(@Scope scope: Construct, @Id id: string) {
    super(scope, id);
  }
}
