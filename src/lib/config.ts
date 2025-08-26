import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 8001,
  DATAMAKER_API_URL:
    process.env.DATAMAKER_API_URL ?? "https://api.datamaker.dev.automators.com",
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME ?? "datamaker-chat",
  S3_REGION: process.env.S3_REGION ?? "auto",
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID!,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY!,
  S3_URL: process.env.S3_URL!,
};
