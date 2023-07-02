import { LocalBackend } from 'cdktf';

import { TerraformCloud } from './stack';

export function construct(stack: TerraformCloud): LocalBackend {
  return new LocalBackend(stack);
}
