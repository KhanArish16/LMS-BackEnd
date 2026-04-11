import Module from "../models/module.js";
import Lesson from "../models/lesson.js";
import Progress from "../models/progress.js";

export const updateProgress = async (req, res) => {
  try {
    const { lessonId, watchedSeconds, completed } = req.body;

    let progress = await Progress.findOne({
      user: req.user.id,
      lesson: lessonId,
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user.id,
        lesson: lessonId,
        watchedSeconds,
        completed,
      });
    } else {
      progress.watchedSeconds = watchedSeconds ?? progress.watchedSeconds;
      progress.completed = completed ?? progress.completed;
      await progress.save();
    }

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

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const courseId = req.params.courseId.trim();

    const modules = await Module.find({ course: courseId });

    const moduleIds = modules.map((m) => m._id);

    const lessons = await Lesson.find({
      module: { $in: moduleIds },
    });

    const lessonIds = lessons.map((l) => l._id);

    const completedLessons = await Progress.find({
      user: req.user.id,
      lesson: { $in: lessonIds },
      completed: true,
    });

    const total = lessons.length;
    const completed = completedLessons.length;

    const percent = total === 0 ? 0 : (completed / total) * 100;

    res.json({
      totalLessons: total,
      completed,
      progress: percent.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
