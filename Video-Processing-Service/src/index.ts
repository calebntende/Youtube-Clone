import express from "express";
import ffmpeg from "fluent-ffmpeg";
const app = express();

const port = 3000;

app.post("/process-video", (req, res) => {
  //get path of the input video file from the request body
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  if(!inputFilePath || !outputFilePath) {
    res.status(400).send("Please provide input and output file paths");
  }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    });