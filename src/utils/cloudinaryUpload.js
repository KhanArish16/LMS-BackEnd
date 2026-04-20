import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (
  fileBuffer,
  folder = "lms",
  mimetype = "",
) => {
  return new Promise((resolve, reject) => {
    const resourceType = mimetype.startsWith("video") ? "video" : "image";
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
