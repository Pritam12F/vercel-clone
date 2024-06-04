import { S3 } from "aws-sdk";
import fs from "fs";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

export const r2Client = new S3({
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.ACCESS_KEY || "",
  secretAccessKey: process.env.SECRET || "",
});

export const downloadFiles = async (id: string | undefined) => {
  if (!id) {
    console.log("early return");
    return;
  }
  const allFiles = await r2Client
    .listObjectsV2({
      Bucket: "vercel-clone",
      Prefix: `output/${id}`,
    })
    .promise();

  if (!id) {
    return;
  }

  const allPromises =
    allFiles.Contents?.map(({ Key }) => {
      return new Promise(async (res) => {
        if (!Key) {
          res("");
          return;
        }
        const localFilePath = path.join(__dirname, Key);
        const outputFile = fs.createWriteStream(localFilePath);
        const dirName = path.dirname(localFilePath);
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
        }
        r2Client
          .getObject({
            Bucket: "vercel-clone",
            Key,
          })
          .createReadStream()
          .pipe(outputFile)
          .on("finish", () => res(""));
      });
    }) || [];
  console.log("Awaiting");

  await Promise.all(allPromises);

  console.log("Download done!");
};
