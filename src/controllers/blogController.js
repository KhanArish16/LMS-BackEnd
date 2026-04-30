import Blog from "../models/blog.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const createBlog = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    let thumbnail = "";

    const thumbnailFile = req.files?.find(
      (file) => file.fieldname === "thumbnail",
    );

    if (thumbnailFile) {
      const uploaded = await uploadToCloudinary(thumbnailFile, "blogs");
      thumbnail = uploaded.secure_url;
    }

    let content = [];

    if (req.body.content) {
      content = JSON.parse(req.body.content);
    }

    for (let i = 0; i < content.length; i++) {
      if (content[i].type === "IMAGE") {
        const file = req.files?.find((f) => f.fieldname === `image_${i}`);

        if (file) {
          const uploaded = await uploadToCloudinary(file, "blogs");
          content[i].value = uploaded.secure_url;
        }
      }
    }

    const blog = await Blog.create({
      title,
      category,
      thumbnail,
      content,
      author: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [{ title: { $regex: search, $options: "i" } }];
    }

    let query = Blog.find(filter).populate("author", "name");

    if (sort === "latest") {
      query = query.sort({ createdAt: -1 });
    }

    if (sort === "oldest") {
      query = query.sort({ createdAt: 1 });
    }

    const blogs = await query;

    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "_id name email",
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your blog" });
    }

    const { title, category } = req.body;

    const thumbnailFile = req.files?.find(
      (file) => file.fieldname === "thumbnail",
    );

    if (thumbnailFile) {
      const uploaded = await uploadToCloudinary(thumbnailFile, "blogs");
      blog.thumbnail = uploaded.secure_url;
    }

    let content = blog.content;

    if (req.body.content) {
      content = JSON.parse(req.body.content);
    }

    for (let i = 0; i < content.length; i++) {
      if (content[i].type === "IMAGE") {
        const file = req.files?.find((f) => f.fieldname === `image_${i}`);

        if (file) {
          const uploaded = await uploadToCloudinary(file, "blogs");
          content[i].value = uploaded.secure_url;
        }
      }
    }

    blog.title = title || blog.title;
    blog.category = category || blog.category;
    blog.content = content;

    await blog.save();

    res.json({ success: true, data: blog });
  } catch (error) {
    console.error("UPDATE BLOG ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your blog" });
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: "Blog deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
