import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

const accessKeyId = process.env.MY_AWS_ACCESS_KEY_ID || process.env.APP_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.MY_AWS_SECRET_ACCESS_KEY || process.env.APP_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.MY_AWS_REGION || process.env.APP_AWS_REGION || process.env.AWS_REGION;

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
  region,
});

s3.listBuckets((err, data) => {
  if (err) {
    console.log(`S3_ERROR:${err.code || err.message}`);
    process.exit(1);
    return;
  }

  console.log(`S3_OK:${(data?.Buckets || []).length}`);
  process.exit(0);
});
