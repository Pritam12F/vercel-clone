import { S3 } from "aws-sdk";
import fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const r2Client = new S3({
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com/vercel-clone`,
  accessKeyId: process.env.ACCESS_KEY || "",
  secretAccessKey: process.env.SECRET || "",
});

export const uploadFile = async (
  remoteFilePath: string,
  localFilePath: string
) => {
  const content = fs.readFileSync(localFilePath);
  const res = await r2Client
    .upload({
      Key: remoteFilePath,
      Bucket: "vercel-clone",
      Body: content,
    })
    .promise();
};
