import Course from "../models/course.js";
import Module from "../models/module.js";
import Lesson from "../models/lesson.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const createLesson = async (req, res) => {
  try {
    const { title, type, content, moduleId, category, contentUrl } = req.body;

    if (!title || !type || !moduleId) {
      return res.status(400).json({
        success: false,
        message: "Title, type and moduleId are required",
      });
    }

    const module = await Module.findById(moduleId).populate("course");

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const course = await Course.findById(module.course);

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    let finalContentUrl = "";
    let thumbnail = "";

    if (req.files?.file) {
      const uploaded = await uploadToCloudinary(
        req.files.file[0].buffer,
        "lessons",
        req.files.file[0].mimetype,
      );
      finalContentUrl = uploaded.secure_url;
    }

    if (req.files?.thumbnail) {
      const uploadedThumb = await uploadToCloudinary(
        req.files.thumbnail[0].buffer,
        "thumbnails",
        req.files.thumbnail[0].mimetype,
      );
      thumbnail = uploadedThumb.secure_url;
    }

    if (type === "YOUTUBE") {
      if (!contentUrl) {
        return res.status(400).json({ message: "YouTube URL required" });
      }
      finalContentUrl = contentUrl;
    }

    if (type === "VIDEO" && !finalContentUrl) {
      return res.status(400).json({ message: "Video file required" });
    }

    if ((type === "BLOG" || type === "QUIZ") && !content) {
      return res.status(400).json({ message: "Content required" });
    }

    const lesson = await Lesson.create({
      title,
      type,
      module: moduleId,
      category,
      thumbnail,
      contentUrl: type === "VIDEO" || type === "YOUTUBE" ? finalContentUrl : "",
      content: type === "BLOG" || type === "QUIZ" ? content : "",
    });

    res.status(201).json({ success: true, data: lesson });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create lesson",
      error: err.message,
    });
  }
};

export const getLessons = async (req, res) => {
  try {
    const { moduleId, type, category, search, sort } = req.query;
    let filter = {};

    if (moduleId) filter.module = moduleId;
    if (type) filter.type = type;
    if (category) filter.category = category;

    if (search)
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];

    let query = Lesson.find(filter).populate("module");

    const sortOptions = {
      latest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };

    if (sort && sortOptions[sort]) {
      query = query.sort(sortOptions[sort]);
    }

    const lessons = await query;

    res.status(200).json({ success: true, data: lessons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate({
      path: "module",
      populate: { path: "course" },
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (lesson.module.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your lesson" });
    }

    const { title, type, content, category, contentUrl } = req.body;

    let finalContentUrl = lesson.contentUrl;
    let thumbnail = lesson.thumbnail;

    if (req.files?.file) {
      const uploaded = await uploadToCloudinary(
        req.files.file[0].buffer,
        "lessons",
        req.files.file[0].mimetype,
      );
      finalContentUrl = uploaded.secure_url;
    }

    if (req.files?.thumbnail) {
      const uploadedThumb = await uploadToCloudinary(
        req.files.thumbnail[0].buffer,
        "thumbnails",
        req.files.thumbnail[0].mimetype,
      );
      thumbnail = uploadedThumb.secure_url;
    }

    if (title !== undefined) lesson.title = title;
    if (category !== undefined) lesson.category = category;
    if (type !== undefined) lesson.type = type;

    if (type === "YOUTUBE") {
      finalContentUrl = contentUrl;
    }

    if (type === "BLOG" || type === "QUIZ") {
      lesson.content = content;
    }

    lesson.contentUrl = finalContentUrl;
    lesson.thumbnail = thumbnail;

    await lesson.save();

    res.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate({
      path: "module",
      populate: { path: "course" },
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (lesson.module.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your lesson" });
    }

    await lesson.deleteOne();

    res.json({
      success: true,
      message: "Lesson deleted",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
