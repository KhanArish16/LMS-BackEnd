import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/create", protect, upload.any(), createBlog);
router.put("/:id/update", protect, upload.any(), updateBlog);
router.delete("/:id/delete", protect, deleteBlog);

export default router;
