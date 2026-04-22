import express from "express";
import {
  createQuiz,
  getQuiz,
  submitQuiz,
  updateQuiz,
} from "../controllers/quizController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("INSTRUCTOR"), createQuiz);
router.put("/:lessonId", protect, authorizeRoles("INSTRUCTOR"), updateQuiz);
router.get("/:lessonId", getQuiz);
router.post(
  "/:lessonId/submit",
  protect,
  authorizeRoles("STUDENT", "INSTRUCTOR"),
  submitQuiz,
);

export default router;
