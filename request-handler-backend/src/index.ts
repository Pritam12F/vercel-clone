import express from "express";
import cors from "cors";

const app = express();
app.use(express.json(), cors());

app.get("/", (req, res) => {});

app.listen(3002, () => {
  console.log("Listening on port 3002");
});
