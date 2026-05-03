import express from "express";
import { getAllUsers, getMe, updateMe } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMe);

router.put("/me", protect, upload.single("profilePic"), updateMe);

router.get("/", protect, getAllUsers);

export default router;
