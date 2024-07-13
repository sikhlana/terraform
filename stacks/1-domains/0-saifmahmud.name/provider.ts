import { cloudflareProviderFactory } from '@common/providers/cloudflare';
import { namedotcomProviderFactory } from '@common/providers/namedotcom';

export const createNamedotcomProvider = namedotcomProviderFactory(
  process.env.NDC_USERNAME,
  process.env.NDC_TOKEN,
);

export const createCloudflareProvider = cloudflareProviderFactory(
  process.env.CF_API_TOKEN,
);
