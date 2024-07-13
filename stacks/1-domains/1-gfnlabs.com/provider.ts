import { cloudflareProviderFactory } from '@common/providers/cloudflare';
import { namecheapProviderFactory } from '@common/providers/namecheap';

export const createNamecheapProvider = namecheapProviderFactory(
  process.env.NC_USERNAME,
  process.env.NC_API_USER,
  process.env.NC_API_KEY,
);

export const createCloudflareProvider = cloudflareProviderFactory(
  process.env.CF_API_TOKEN,
);
