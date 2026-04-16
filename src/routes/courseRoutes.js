import express from "express";
import {
  createCourse,
  getCourses,
  enrollCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
} from "../controllers/courseController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("INSTRUCTOR"), createCourse);

router.get("/", getCourses);

router.get("/:id", getCourseById);

router.post("/:id/enroll", protect, authorizeRoles("STUDENT"), enrollCourse);

router.put("/:id", protect, authorizeRoles("INSTRUCTOR"), updateCourse);

router.delete("/:id", protect, authorizeRoles("INSTRUCTOR"), deleteCourse);

export default router;
