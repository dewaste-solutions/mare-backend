// https://docs.digitalocean.com/reference/api/spaces/


// Load dependencies
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

const s3Client = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT,
  region: process.env.SPACES_REGION,
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
  forcePathStyle: false,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // file size limit
  }
}).single('upload');

const uploadObject = async (file) => {

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileExtension = file.originalname.split('.').pop();
  const newFilename = `${file.originalname.replace(`.${fileExtension}`, '')}_${timestamp}.${fileExtension}`;

  const params = {
    Bucket: "testing-dwsdb-56",
    Key: newFilename,
    Body: file.buffer,
    ACL: "public-read", // private or public-read
    ContentType: file.mimetype,
    Metadata: {
      "x-amz-meta-uploaded-by": "public", // or any other identifier
      "x-amz-meta-original-filename": file.originalname,
      "x-amz-meta-upload-date": new Date().toISOString(),
      "x-amz-meta-file-type": file.mimetype,
      "x-amz-meta-file-size": file.size.toString(),
      "x-amz-meta-file-extension": file.originalname.split('.').pop(),
    }
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(params));

    const fileUrl = `https://${params.Bucket}.${process.env.SPACES_ENDPOINT.replace('https://', '')}/${params.Key}`;

    console.log(
      "Successfully uploaded object: " +
        params.Bucket +
        "/" +
        params.Key
    );

    console.log({data, fileUrl});

    // return {
    //   ...data,
    //   fileUrl
    // };
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};


// Views in public directory
app.use(express.static('public'));

// Routes
app.get('/', (_request, response) => {
  response.sendFile(__dirname + '/public/index.html');
});

app.get("/success", (request, response) => {
  response.sendFile(__dirname + '/public/success.html');
});

app.get("/error", (_request, response) => {
  response.sendFile(__dirname + '/public/error.html');
});

app.post('/upload', async (request, response, _next) => {
  upload(request, response, async function (error) {
    if (error) {
      console.log(error);
      return response.redirect("/error");
    }
    try {
      if (!request.file) {
        throw new Error('No file uploaded');
      }
      await uploadObject(request.file);
      console.log('File uploaded successfully.');
      response.redirect("/success");
    } catch (err) {
      console.error('Upload error:', err);
      response.redirect("/error");
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000.');
});