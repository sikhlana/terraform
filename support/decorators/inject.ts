import {
  CURRENT_STACK,
  PARENT_SCOPE,
  SCOPE_ID,
  STACK_VARIABLES,
} from '@support/symbols';
import { Construct } from 'constructs';
import { delay, inject } from 'tsyringe';
import { Class } from 'type-fest';

export const Id = inject(SCOPE_ID);
export const Scope = inject(PARENT_SCOPE);
export const Stack = inject(CURRENT_STACK);
export const Vars = inject(STACK_VARIABLES);

export function Constructed(token: Class<Construct> | string) {
  return inject(
    typeof token === 'string' ? `construct:${token}` : delay(() => token),
  );
}

export function Provider(token: string) {
  return inject(`provider:${token}`);
}
