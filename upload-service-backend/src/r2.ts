import { S3 } from "aws-sdk";
import fs from "fs";

const r2Client = new S3({
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com/vercel-clone`,
  accessKeyId: process.env.ACCESS_KEY || "",
  secretAccessKey: process.env.SECRET || "",
});

export const uploadFile = async (fileName: string, localFilePath: string) => {
  const content = fs.readFileSync(localFilePath);
  const res = await r2Client
    .upload({
      Key: fileName,
      Bucket: "vercel-clone",
      Body: content,
    })
    .promise();
};
