import express from "express";
import {
  getStudentAnalytics,
  getInstructorAnalytics,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/student", protect, getStudentAnalytics);

router.get("/instructor", protect, getInstructorAnalytics);

export default router;
