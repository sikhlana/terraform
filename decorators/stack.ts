export const SELF_DECLARED_STACKS_METADATA = Symbol();

export function Stack(): PropertyDecorator {
  return (target: any, key: string | symbol) => {
    const stack = Reflect.getMetadata('design:type', target, key);

    const resources =
      Reflect.getMetadata(SELF_DECLARED_STACKS_METADATA, target.constructor) ||
      [];

    Reflect.defineMetadata(
      SELF_DECLARED_STACKS_METADATA,
      [...resources, { key, stack }],
      target.constructor,
    );
  };
}
