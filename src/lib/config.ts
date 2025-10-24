import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 8001,
  DATAMAKER_API_URL:
    process.env.DATAMAKER_API_URL ?? "https://api.datamaker.dev.automators.com",
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME ?? "datamaker-chat",
  R2_REGION: process.env.R2_REGION ?? "auto",
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID!,
  R2_SECRET: process.env.R2_SECRET!,
  R2_URL: process.env.R2_URL!,
};

export const RESPONSE_TOKEN_THRESHOLD = 5000;
