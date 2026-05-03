import express from "express";
import {
  createLesson,
  deleteLesson,
  getLessonById,
  getLessons,
  updateLesson,
} from "../controllers/lessonController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("INSTRUCTOR"), createLesson);

router.get("/", getLessons);

router.get("/:id", getLessonById);

router.put("/:id", protect, authorizeRoles("INSTRUCTOR"), updateLesson);

router.delete("/:id", protect, authorizeRoles("INSTRUCTOR"), deleteLesson);

export default router;
