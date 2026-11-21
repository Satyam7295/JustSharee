import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(moduleDir, "../../.env") });

export const awsRegion = process.env.MY_AWS_REGION || process.env.APP_AWS_REGION || process.env.AWS_REGION;
export const awsAccessKeyId = process.env.MY_AWS_ACCESS_KEY_ID || process.env.APP_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
export const awsSecretAccessKey = process.env.MY_AWS_SECRET_ACCESS_KEY || process.env.APP_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
export const awsBucketName = process.env.MY_AWS_BUCKET_NAME || process.env.APP_AWS_BUCKET_NAME || process.env.AWS_BUCKET_NAME || process.env.AWS_S3_BUCKET_NAME;

const explicitCredentials = awsAccessKeyId && awsSecretAccessKey
  ? { accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretAccessKey }
  : undefined;

const s3 = new S3Client({
  region: awsRegion,
  ...(explicitCredentials ? { credentials: explicitCredentials } : {})
});

export default s3;