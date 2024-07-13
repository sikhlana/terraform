import { digitaloceanProviderFactory } from '@common/providers/digitalocean';

export { createTlsProvider } from '@common/providers/tls';

export const createDigitalOceanProvider = digitaloceanProviderFactory(
  process.env.DO_TOKEN,
);
