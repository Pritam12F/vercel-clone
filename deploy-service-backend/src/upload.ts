import fs from "fs";
import path from "path";
import { r2Client } from "./r2";

export const uploadFiles = async (id: string | undefined) => {
  const allFiles = getAllFiles(path.join(__dirname, `output/${id}/dist`));
  allFiles.forEach(async (key) => {
    const remoteFilePath = key.slice(key.indexOf("/output") + 1);
    await uploadFile(remoteFilePath, key);
  });
  console.log("Uploaded to r2!");
  fs.rmdirSync(path.join(__dirname, `output/${id}`), { recursive: true });
  console.log("Deleted !");
};

const getAllFiles = (folderPath: string) => {
  let response: string[] = [];

  const allFilesAndFolders = fs.readdirSync(folderPath);
  allFilesAndFolders.forEach((file) => {
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });
  return response;
};

const uploadFile = async (remoteFilePath: string, localFilePath: string) => {
  const content = fs.readFileSync(localFilePath);
  const res = await r2Client
    .upload({
      Key: remoteFilePath,
      Bucket: "vercel-clone",
      Body: content,
    })
    .promise();
};
