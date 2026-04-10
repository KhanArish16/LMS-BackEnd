import express from "express";
import { createLesson, getLessons } from "../controllers/lessonController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", protect, authorizeRoles("INSTRUCTOR"), createLesson);

router.get("/", getLessons);

export default router;
