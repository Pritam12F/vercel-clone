import express from "express";
import cors from "cors";
import { r2Client } from "./r2";

const app = express();
app.use(express.json(), cors());

app.get("/*", async (req, res) => {
  const url = req.headers.host;
  const id = url?.split(".")[0];

  const filePath = req.path;

  console.log(`output/${id}/dist${filePath}`);
  const file = await r2Client
    .getObject({
      Key: `output/${id}/dist${filePath}`,
      Bucket: "vercel-clone",
    })
    .promise();

  const type = filePath.endsWith("html")
    ? "text/html"
    : filePath.endsWith("css")
    ? "text/css"
    : "application/javascript";

  res.set("Content-Type", type);

  res.send(file.Body);
});

app.listen(3001, () => {
  console.log("Listening on port 3001");
});
