import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { getAllFiles } from "./utils/getAllFiles";
import { generateId } from "./utils/generateId";
import path from "path";

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

      console.log(result);

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
