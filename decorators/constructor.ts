import { each } from 'lodash';

export const CONSTRUCTOR_METADATA = Symbol();
export const PARAM_DEPS_METADATA = Symbol();

export function Constructor(): MethodDecorator {
  return (target: Object, key: string | symbol) => {
    Reflect.defineMetadata(CONSTRUCTOR_METADATA, key, target.constructor);

    each(
      Reflect.getMetadata('design:paramtypes', target, key),
      (type, index) => {
        const resources =
          Reflect.getMetadata(PARAM_DEPS_METADATA, target.constructor, key) ||
          [];

        Reflect.defineMetadata(
          PARAM_DEPS_METADATA,
          [...resources, { index, type }],
          target.constructor,
          key,
        );
      },
    );
  };
}
