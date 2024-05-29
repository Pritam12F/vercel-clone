import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { getAllFiles } from "./utils/getAllFiles";

const app = express();
const PORT = 3002;

app.use(
  cors({
    origin: "http://localhost:3000/",
  })
);
app.use(express.json());

const generateId = () => {
  let str = "";
  let alpha = "abcdefghijklmnopqrstuvwxyz";

  const random = Math.floor(Math.random() * 100000) + 1;

  for (let i = 0; i < 5; ++i) {
    const randomAl = alpha[Math.floor(Math.random() * 26)];
    str += randomAl;
  }

  str = str.concat(random.toString());

  return str;
};

app.post("/upload", async (req, res) => {
  const url = req.body?.gitUrl;
  const id = generateId();

  if (url) {
    await simpleGit().clone(url, `output/${id}`);

    const result = getAllFiles(`output/${id}`);

    console.log(result);

    return res.json({
      message: id,
    });
  }
  return res.json({
    error: "No url provided",
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
