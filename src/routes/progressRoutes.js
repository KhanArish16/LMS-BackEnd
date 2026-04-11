import express from "express";
import {
  updateProgress,
  getLessonProgress,
  getCourseProgress,
} from "../controllers/progressController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, updateProgress);

router.get("/lesson/:lessonId", protect, getLessonProgress);

router.get("/course/:courseId", protect, getCourseProgress);

export default router;
