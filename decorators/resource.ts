export const SELF_DECLARED_RESOURCES_METADATA = Symbol();
export const PARAM_RESOURCES_METADATA = Symbol();

export function Resource(id: string): PropertyDecorator & ParameterDecorator {
  return (target: any, key: string | symbol | undefined, index?: number) => {
    if (typeof index === 'undefined') {
      const resources =
        Reflect.getMetadata(
          SELF_DECLARED_RESOURCES_METADATA,
          target.constructor,
        ) || [];

      Reflect.defineMetadata(
        SELF_DECLARED_RESOURCES_METADATA,
        [...resources, { key, id }],
        target.constructor,
      );
    } else {
      if (key) {
        const resources =
          Reflect.getMetadata(
            PARAM_RESOURCES_METADATA,
            target.constructor,
            key,
          ) || [];

        Reflect.defineMetadata(
          PARAM_RESOURCES_METADATA,
          [...resources, { index, id }],
          target.constructor,
          key,
        );
      } else {
        const resources =
          Reflect.getMetadata(PARAM_RESOURCES_METADATA, target) || [];

        Reflect.defineMetadata(
          PARAM_RESOURCES_METADATA,
          [...resources, { index, id }],
          target,
        );
      }
    }
  };
}
