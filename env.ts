declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      TFE_ORGANIZATION: string | '';
      // Add all the environment variables here...
    }
  }
}

export {};
