import express from "express";
import {
  createLesson,
  deleteLesson,
  getLessons,
  updateLesson,
} from "../controllers/lessonController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("INSTRUCTOR"), createLesson);

router.get("/", getLessons);

router.put("/:id", protect, authorizeRoles("INSTRUCTOR"), updateLesson);

router.delete("/:id", protect, authorizeRoles("INSTRUCTOR"), deleteLesson);

export default router;
