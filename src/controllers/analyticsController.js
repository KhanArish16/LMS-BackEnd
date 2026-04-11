import Course from "../models/course.js";
import Module from "../models/module.js";
import Lesson from "../models/lesson.js";
import Progress from "../models/progress.js";
import Quiz from "../models/quiz.js";

export const getStudentAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const courses = await Course.find({ students: userId });
    const modules = await Module.find({
      course: { $in: courses.map((c) => c._id) },
    });

    const lessons = await Lesson.find({
      module: { $in: modules.map((m) => m._id) },
    });

    const completed = await Progress.find({
      user: userId,
      lesson: { $in: lessons.map((l) => l._id) },
      completed: true,
    });

    const progress =
      lessons.length === 0 ? 0 : (completed.length / lessons.length) * 100;

    res.json({
      totalCourses: courses.length,
      totalLessons: lessons.length,
      completedLessons: completed.length,
      progress: progress.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInstructorAnalytics = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const courses = await Course.find({ instructor: instructorId });
    const totalStudents = courses.reduce(
      (acc, course) => acc + course.students.length,
      0,
    );

    const modules = await Module.find({
      course: { $in: courses.map((c) => c._id) },
    });

    const lessons = await Lesson.find({
      module: { $in: modules.map((m) => m._id) },
    });

    const completed = await Progress.find({
      lesson: { $in: lessons.map((l) => l._id) },
      completed: true,
    });

    const completionRate =
      lessons.length === 0 ? 0 : (completed.length / lessons.length) * 100;

    res.json({
      totalCourses: courses.length,
      totalStudents,
      totalLessons: lessons.length,
      completionRate: completionRate.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
