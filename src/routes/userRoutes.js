import express from "express";
import { updateProfilePic, getProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/profile-pic", protect, updateProfilePic);

export default router;
