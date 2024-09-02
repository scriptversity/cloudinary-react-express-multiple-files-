const express = require("express");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const multiparty = require("multiparty");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT;

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.post("/upload", async function (req, res) {
  const urls = [];
  console.log(urls);
  const form = new multiparty.Form({ maxFieldsSize: "20MB" });
  form.parse(req, async function (err, fields, files) {
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      folder: "/test",
    };
    const filesData = fields.file;
    for (let i = 0; i < filesData.length; i++) {
      const imagePath = filesData[i];
      try {
        const result = await cloudinary.uploader.upload(imagePath, options);
        urls.push(result.secure_url);
        if (i === filesData.length - 1 && !!result.secure_url) {
          return res.status(200).json({ data: urls });
        }
      } catch (error) {
        console.error(error);
        return res.status(400);
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
