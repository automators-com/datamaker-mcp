import { S3Client } from "@aws-sdk/client-s3";
import { ENV } from "./config.js";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: ENV.S3_URL,
  credentials: {
    accessKeyId: ENV.S3_ACCESS_KEY_ID,
    secretAccessKey: ENV.S3_SECRET_ACCESS_KEY,
  },
});
