require("dotenv").config();
const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require("fs");

// const app = express();
const app = new express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.ACCESS_KEY,
})

const bucketName = "red9ja-videos";

app.use(
  cors({
    origin: ["http://localhost:8888", "http://mlifeinvestmenthub.com", "https://mlifeinvestmenthub.com", "https://www.mlifeinvestmenthub.com"],
  })
);

app.get("/", (_, res) => {
  res.send({ welcome: "This is a personal project!" });
});

const upload = multer({
  dest: "/tmp",
  limits: {
    fieldSize: 107_374_182_400,
    fieldNameSize: 107_374_182_400,
  },
});

app.post(
  "/upload/img",
  upload.single("image"),
  async ({ body: { name }, file }, res) => {
    try {
      const response = await s3
        .upload({
          Bucket: bucketName,
          Key: name + "_" + Date.now(),
          Body: fs.createReadStream(file.path),
          ContentType: file.mimetype,
          ACL: "public-read",
        })
        .promise();
      return res.send(response);
    } catch (error) {
      console.log(error);
    }
  }
);

// app.listen(process.env.PORT || 80, console.log("Server on PORT:80"));
module.exports = app;