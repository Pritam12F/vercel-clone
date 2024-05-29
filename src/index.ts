import express from "express";

const app = express();
const PORT = 3002;

app.use(express.json());

app.post("/upload", async (req, res) => {
  const url = req.body?.gitUrl;

  if (url) {
    return res.json({
      message: "Caught!",
    });
  }
  return res.json({
    error: "No url provided",
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
