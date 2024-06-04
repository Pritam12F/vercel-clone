import { S3 } from "aws-sdk";
import * as dotenv from "dotenv";

dotenv.config();

export const r2Client = new S3({
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.ACCESS_KEY || "",
  secretAccessKey: process.env.SECRET || "",
});
