import Module from "../models/module.js";
import Course from "../models/course.js";

export const createModule = async (req, res) => {
  try {
    const { title, description, courseId, order } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    const module = await Module.create({
      title,
      description,
      course: courseId,
      order,
    });

    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getModules = async (req, res) => {
  try {
    const { courseId } = req.params;

    const modules = await Module.find({ course: courseId }).sort({ order: 1 });

    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate("course");

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    if (module.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your module" });
    }

    const updated = await Module.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate("course");

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    if (module.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your module" });
    }

    await module.deleteOne();

    res.json({ message: "Module deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
