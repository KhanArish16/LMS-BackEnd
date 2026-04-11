import express from "express";
import {
  createModule,
  deleteModule,
  getModules,
  updateModule,
} from "../controllers/moduleController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("INSTRUCTOR"), createModule);

router.get("/:courseId", getModules);

router.put("/:id", protect, authorizeRoles("INSTRUCTOR"), updateModule);

router.delete("/:id", protect, authorizeRoles("INSTRUCTOR"), deleteModule);

export default router;
