import Module from "../models/module.js";
import Course from "../models/course.js";

export const createModule = async (req, res) => {
  try {
    const { title, description, courseId, order } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Title and courseId are required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    let finalOrder = order;

    if (!order) {
      const lastModule = await Module.findOne({ course: courseId }).sort({
        order: -1,
      });

      finalOrder = lastModule ? lastModule.order + 1 : 1;
    }

    const module = await Module.create({
      title,
      description,
      course: courseId,
      order: finalOrder,
    });

    res.status(201).json({
      success: true,
      data: module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create module",
      error: error.message,
    });
  }
};

export const getModules = async (req, res) => {
  try {
    const { courseId } = req.params;

    const modules = await Module.find({ course: courseId }).sort({ order: 1 });

    res.json({ success: true, data: modules });
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

    const { title, description, order } = req.body;

    if (title !== undefined) module.title = title;
    if (description !== undefined) module.description = description;
    if (order !== undefined) module.order = order;

    await module.save();

    res.json({
      success: true,
      data: module,
    });
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

    res.json({
      success: true,
      message: "Module deleted",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
