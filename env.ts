declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      BACKEND_S3_ACCESS_KEY: string;
      BACKEND_S3_BUCKET: string;
      BACKEND_S3_REGION: string;
      BACKEND_S3_SECRET_KEY: string;
      CF_API_TOKEN: string;
      DO_TOKEN: string;
      NC_API_KEY: string;
      NC_API_USER: string;
      NC_USERNAME: string;
      NDC_TOKEN: string;
      NDC_USERNAME: string;
      TFE_ORGANIZATION: string | '';
    }
  }
}

export {};
