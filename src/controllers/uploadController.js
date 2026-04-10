import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        res.json({ url: result.secure_url });
      },
    );

    result.end(file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
