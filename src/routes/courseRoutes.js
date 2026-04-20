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
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("INSTRUCTOR"),
  upload.single("thumbnail"),
  createCourse,
);

router.get("/", getCourses);

router.get("/:id", getCourseById);

router.post("/:id/enroll", protect, authorizeRoles("STUDENT"), enrollCourse);

router.put(
  "/:id",
  protect,
  authorizeRoles("INSTRUCTOR"),
  upload.single("thumbnail"),
  updateCourse,
);

router.delete("/:id", protect, authorizeRoles("INSTRUCTOR"), deleteCourse);

export default router;
