import { S3Backend, TerraformStack } from 'cdktf';
import { kebabCase } from 'scule';

export function s3BackendFactory(
  region: string,
  bucket: string,
  accessKey: string,
  secretKey: string,
): (stack: TerraformStack) => void {
  return (stack: TerraformStack) => {
    new S3Backend(stack, {
      key: `${kebabCase(stack.node.id)}.tfstate`,
      bucket,
      region,
      accessKey,
      secretKey,
    });
  };
}
