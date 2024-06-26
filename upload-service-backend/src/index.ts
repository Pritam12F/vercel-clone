import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { getAllFiles } from "./utils/getAllFiles";
import { generateId } from "./utils/generateId";
import path from "path";
import { uploadFile } from "./r2";
import { createClient } from "redis";
import fs from "fs";

const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.post("/upload", async (req, res) => {
  const url = req.body?.gitUrl;
  const id = generateId();
  console.log("Caught!");
  console.log(id);
  if (url) {
    try {
      await simpleGit().clone(url, path.join(__dirname, `output/${id}`));

      const result = getAllFiles(path.join(__dirname, `output/${id}`));

      result.forEach(async (el) => {
        const remoteFilePath = el.substring(__dirname.length + 1);
        await uploadFile(remoteFilePath, el);
      });

      await new Promise((resolve) => setTimeout(resolve, 5000));

      fs.rmdirSync(path.join(__dirname, `output/${id}`), { recursive: true });
      publisher.lPush("vercel-build-queue", id);
      publisher.hSet("status", id, "uploaded");

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

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const status = await subscriber.hGet("status", id as string);
  if (status === "deployed") {
    return res.json({
      status: "deployed",
    });
  } else {
    return res.json({
      status: "uploaded",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
