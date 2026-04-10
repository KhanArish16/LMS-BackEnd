import express from "express";
import {
  createCourse,
  getCourses,
  enrollCourse,
} from "../controllers/courseController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("INSTRUCTOR"), createCourse);

router.get("/", getCourses);

router.post("/:id/enroll", protect, authorizeRoles("STUDENT"), enrollCourse);

export default router;
