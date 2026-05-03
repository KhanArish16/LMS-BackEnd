import Course from "../models/course.js";
import Module from "../models/module.js";
import Lesson from "../models/lesson.js";

export const createLesson = async (req, res) => {
  try {
    const { title, type, content, moduleId, category, contentUrl } = req.body;

    if (!title || !type || !moduleId) {
      return res.status(400).json({
        message: "Title, type and moduleId required",
      });
    }

    const module = await Module.findById(moduleId).populate("course");

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    if (module.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    if (type === "VIDEO") {
      if (!contentUrl || contentUrl === "undefined") {
        return res.status(400).json({
          message: "Video URL required",
        });
      }
    }

    if (type === "YOUTUBE") {
      if (!contentUrl || contentUrl.trim() === "") {
        return res.status(400).json({
          message: "YouTube URL required",
        });
      }
    }

    if (type === "BLOG") {
      if (!content || content.trim() === "") {
        return res.status(400).json({
          message: "Blog content required",
        });
      }
    }

    if (type === "QUIZ") {
    }

    const lesson = await Lesson.create({
      title,
      type,
      module: moduleId,
      category,
      contentUrl: type === "VIDEO" || type === "YOUTUBE" ? contentUrl : "",
      content: type === "BLOG" ? content : "",
    });

    res.status(201).json({
      success: true,
      data: lesson,
    });
  } catch (err) {
    console.error("CREATE LESSON ERROR:", err);
    res.status(500).json({
      message: "Server error",
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

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    let query = Lesson.find(filter).populate("module");

    const sortOptions = {
      latest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };

    if (sort && sortOptions[sort]) {
      query = query.sort(sortOptions[sort]);
    }

    const lessons = await query;

    res.status(200).json({
      success: true,
      data: lessons,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate({
      path: "module",
      populate: { path: "course", select: "title" },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

    if (title) lesson.title = title;
    if (category) lesson.category = category;
    if (type) lesson.type = type;

    if (type === "VIDEO" || type === "YOUTUBE") {
      if (contentUrl) {
        lesson.contentUrl = contentUrl;
      }
    }

    if (type === "BLOG") {
      lesson.content = content;
    }

    if (type === "QUIZ") {
    }

    await lesson.save();

    res.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    console.error("UPDATE LESSON ERROR:", error);
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
