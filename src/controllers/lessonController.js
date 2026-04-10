import lesson from "../models/lesson";
import Course from "../models/course";
import Module from "../models/module";

export const createLesson = async (req, res) => {
  try {
    const { title, type, contentUrl, content, thumbnail, moduleId, category } =
      req.body;

    const module = await Module.findById(moduleId).populate("course");

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
  } catch {}
};
