import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { getAllFiles } from "./utils/getAllFiles";
import { generateId } from "./utils/generateId";
import path from "path";
import { uploadFile } from "./r2";
import { createClient } from "redis";
import fs from "fs";

const client = createClient();
client.connect();
const app = express();
const PORT = 3002;

app.use(
  cors({
    origin: "http://localhost:3000/",
  })
);
app.use(express.json());

app.post("/upload", async (req, res) => {
  const url = req.body?.gitUrl;
  const id = generateId();

  if (url) {
    try {
      await simpleGit().clone(url, path.join(__dirname, `output/${id}`));

      const result = getAllFiles(path.join(__dirname, `output/${id}`));

      result.forEach(async (el) => {
        const remoteFilePath = el.substring(__dirname.length + 1);
        await uploadFile(remoteFilePath, el);
      });

      fs.rmdirSync(path.join(__dirname, `output/${id}`), { recursive: true });
      client.lPush("vercel-build-queue", id);

      return res.json({
        id,
      });
    } catch (err) {
      return res.json({
        error: "Invalid repo url",
      });
    }
  }
  return res.json({
    error: "No url provided",
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
