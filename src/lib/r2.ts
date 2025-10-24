import { S3Client } from "@aws-sdk/client-s3";
import { ENV } from "./config.js";

export const r2 = new S3Client({
  region: "auto",
  endpoint: ENV.R2_URL!,
  forcePathStyle: true,
  credentials: {
    accessKeyId: ENV.R2_ACCESS_KEY_ID!,
    secretAccessKey: ENV.R2_SECRET!,
  },
});
