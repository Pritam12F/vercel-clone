import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { getAllFiles } from "./utils/getAllFiles";
import { generateId } from "./utils/generateId";
import path from "path";
import { uploadFile } from "./r2";

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
  const seperator = path.sep;
  const id = generateId();

  if (url) {
    try {
      await simpleGit().clone(url, path.join(__dirname, `output/${id}`));

      const result = getAllFiles(path.join(__dirname, `output/${id}`));
      let it = 0;

      result.forEach((el) => {
        const res = el.split(seperator);
        const remoteFilePath = `output/${id}/${res[res.length - 1]}`;

        uploadFile(remoteFilePath, result[it++]);
      });

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
