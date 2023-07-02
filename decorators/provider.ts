import { TerraformProvider } from 'cdktf';
import { Constructor } from 'type-fest';

export const PROVIDER_METADATA = Symbol();

export function Provider<TProvider extends Constructor<TerraformProvider>>(
  provider: TProvider,
  config?: ConstructorParameters<TProvider>[2],
): ClassDecorator {
  return (target) => {
    const providers = Reflect.getMetadata(PROVIDER_METADATA, target) ?? [];

    Reflect.defineMetadata(
      PROVIDER_METADATA,
      [...providers, { provider, config }],
      target,
    );
  };
}
