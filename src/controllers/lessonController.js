import Course from "../models/course.js";
import Module from "../models/module.js";
import Lesson from "../models/lesson.js";

export const createLesson = async (req, res) => {
  try {
    const { title, type, contentUrl, content, thumbnail, moduleId, category } =
      req.body;

    const module = await Module.findById(moduleId).populate("course");

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const course = await Course.findById(module.course);

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    const lesson = await Lesson.create({
      title,
      type,
      contentUrl,
      content,
      module: moduleId,
      category,
      thumbnail,
    });

    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLessons = async (req, res) => {
  try {
    const { type, category } = req.query;
    let filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;

    const lessons = await Lesson.find(filter).populate("module");
    res.status(200).json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
