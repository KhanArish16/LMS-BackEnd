import Course from "../models/course.js";

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user.id,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCourses = async (req, res) => {
  try {
    const { category, level, sort } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (level) filter.level = level;

    let query = Course.find(filter)
      .populate("instructor", "name email")
      .populate("students", "name email");

    if (sort === "latest") {
      query = query.sort({ createdAt: -1 });
    }

    const courses = await query;

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.students.includes(req.user.id)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.students.push(req.user.id);
    await course.save();

    res.json({ message: "Enrolled successfully", course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
