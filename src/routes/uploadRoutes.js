import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadImage } from "../controller/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/image", protect, upload.single("file"), uploadImage);

export default router;
