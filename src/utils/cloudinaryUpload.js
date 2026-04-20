import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (file, folder = "lms") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return reject(error);
        }
        resolve(result);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};
