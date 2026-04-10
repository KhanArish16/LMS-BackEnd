import express from "express";
import { createModule, getModules } from "../controllers/moduleController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("INSTRUCTOR"), createModule);

router.get("/:courseId", getModules);

export default router;
