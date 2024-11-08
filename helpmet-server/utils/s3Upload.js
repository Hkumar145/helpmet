require('dotenv').config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

const BUCKET_NAME = 'pika-helpmet';

const uploadToS3 = async (files) => {
  const uploadPromises = files.map(async (file) => {
    const fileKey = `${Date.now()}_${file.originalname}`;
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
      // console.log("Uploaded file URL:", fileUrl);
      return fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("File upload failed");
    }
  });

  return Promise.all(uploadPromises);
};

module.exports = { uploadToS3 };