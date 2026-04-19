import Module from "../models/module.js";
import Lesson from "../models/lesson.js";
import Progress from "../models/progress.js";

export const updateProgress = async (req, res) => {
  try {
    const { lessonId, courseId, watchedSeconds, completed } = req.body;

    let progress = await Progress.findOneAndUpdate(
      {
        user: req.user.id,
        lesson: lessonId,
      },
      {
        $set: {
          watchedSeconds,
          completed,
          course: courseId,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLessonProgress = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const progress = await Progress.findOne({
      user: req.user.id,
      lesson: lessonId,
    });

    res.json(progress || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const totalLessons = await Lesson.countDocuments({
      module: {
        $in: await Module.find({ course: courseId }).distinct("_id"),
      },
    });

    const completed = await Progress.countDocuments({
      user: req.user.id,
      course: courseId,
      completed: true,
    });

    const percent = totalLessons === 0 ? 0 : (completed / totalLessons) * 100;

    res.json({
      totalLessons,
      completed,
      progress: Math.round(percent),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
