import { Workspace } from '@cdktf/provider-tfe/lib/workspace';
import type { TerraformStack } from 'cdktf';

export interface StackDetails {
  backend?: {
    functions: Generator<(stack: TerraformStack) => void>;
  };
  path: string;
  stack: TerraformStack;
  workspace?: {
    functions: Generator<(workspace: Workspace) => void> | [];
  };
}
