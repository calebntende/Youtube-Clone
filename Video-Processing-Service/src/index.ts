import express from "express";

import { SetupDirectories, convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, uploadProcessedVideo} from "./storage";


SetupDirectories();

const app = express();
app.use(express.json());



app.post("/process-video", async(req, res) => {
  
  // get the bucket and filename from the cloud pub/sub message

  
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload received.');
    }
  } catch(error){
    console.error(error);
    res.status(400).send('Bad Request: missing filename.');
    return;
  }
  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

  // download the video from cloud storate

  await downloadRawVideo(inputFileName);

  // upload the processed video

  try {

    await convertVideo(inputFileName, outputFileName);
  
  }catch(err) {
    await Promise.all([deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)]
    );
    console.error(err);
    return res.status(500).send('Internal Server Error; video processing failed. ');

  }





  await uploadProcessedVideo(outputFileName);


  await Promise.all([deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName)]

    
  );

  return res.status(200).send('Processing finished successfully.');

});

const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    });