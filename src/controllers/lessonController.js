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

    res.status(200).json(lessons);
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

    const updated = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
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

    res.json({ message: "Lesson deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
