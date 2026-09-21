import AWS from "aws-sdk";

export const awsRegion = process.env.MY_AWS_REGION || process.env.APP_AWS_REGION || process.env.AWS_REGION;
export const awsAccessKeyId = process.env.MY_AWS_ACCESS_KEY_ID || process.env.APP_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
export const awsSecretAccessKey = process.env.MY_AWS_SECRET_ACCESS_KEY || process.env.APP_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
export const awsBucketName = process.env.MY_AWS_BUCKET_NAME || process.env.APP_AWS_BUCKET_NAME || process.env.AWS_BUCKET_NAME || process.env.AWS_S3_BUCKET_NAME;

const s3 = new AWS.S3({
  accessKeyId: awsAccessKeyId,
  secretAccessKey: awsSecretAccessKey,
  region: awsRegion
});

export default s3;