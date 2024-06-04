import express from "express";
import cors from "cors";

const app = express();
app.use(express.json(), cors());

app.get("/*", (req, res) => {
  const url = req.headers.host;
  const id = url?.split(".")[0];

  return res.json({
    id,
  });
});

app.listen(3001, () => {
  console.log("Listening on port 3001");
});
