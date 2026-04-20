import Course from "../models/course.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const createCourse = async (req, res) => {
  try {
    const { title, description, category, level } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    let thumbnail = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "courses",
        req.file.mimetype,
      );
      thumbnail = uploaded.secure_url;
    }

    const course = await Course.create({
      title,
      description,
      category,
      level,
      instructor: req.user.id,
      thumbnail,
    });

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "failed to create course",
    });
  }
};

export const getCourses = async (req, res) => {
  try {
    const { category, level, sort, search } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (level) filter.level = level;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let query = Course.find(filter)
      .populate("instructor", "_id name email")
      .populate("students", "_id name email");

    if (sort === "latest") {
      query = query.sort({ createdAt: -1 });
    }

    if (sort === "oldest") {
      query = query.sort({ createdAt: 1 });
    }

    const courses = await query;

    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "_id name email")
      .populate("students", "_id name email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const alreadyEnrolled = course.students.some(
      (id) => id.toString() === req.user.id,
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.students.push(req.user.id);
    await course.save();

    res.json({
      success: true,
      message: "Enrolled successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    const { title, description, category, level } = req.body;

    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "courses",
        req.file.mimetype,
      );
      course.thumbnail = uploaded.secure_url;
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.level = level || course.level;

    await course.save();

    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    await course.deleteOne();
    res.json({ success: true, message: "Course deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
