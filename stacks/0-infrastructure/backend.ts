import { s3BackendFactory } from '@common/backends/s3';

export const createS3Backend = s3BackendFactory(
  process.env.BACKEND_S3_REGION,
  process.env.BACKEND_S3_BUCKET,
  process.env.BACKEND_S3_ACCESS_KEY,
  process.env.BACKEND_S3_SECRET_KEY,
);
