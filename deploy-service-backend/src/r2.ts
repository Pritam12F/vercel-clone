import { S3 } from "aws-sdk";
import fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const r2Client = new S3({
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com/vercel-clone`,
  accessKeyId: process.env.ACCESS_KEY || "",
  secretAccessKey: process.env.SECRET || "",
});

export const downloadFiles = async (id: string) => {
  const allFiles = await r2Client
    .listObjectsV2({
      Bucket: "vercel-clone",
      Prefix: `vercel-clone/output/${id}`,
    })
    .promise();
};
