import Quiz from "../models/quiz.js";
import Lesson from "../models/lesson.js";

export const createQuiz = async (req, res) => {
  try {
    const { lessonId, questions } = req.body;

    if (!lessonId) {
      return res.status(400).json({ message: "lessonId required" });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Invalid questions format" });
    }

    const lesson = await Lesson.findById(lessonId).populate({
      path: "module",
      populate: { path: "course" },
    });

    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    if (lesson.type !== "QUIZ") {
      return res.status(400).json({ message: "Lesson is not Quiz Type" });
    }

    if (lesson.module.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    const quiz = await Quiz.findOneAndUpdate(
      { lesson: lessonId },
      { lesson: lessonId, questions },
      { new: true, upsert: true },
    );

    res.status(200).json({ success: true, data: quiz });
  } catch (err) {
    console.error("CREATE QUIZ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const quiz = await Quiz.findOne({ lesson: lessonId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Invalid questions format" });
    }

    const quiz = await Quiz.findOneAndUpdate(
      { lesson: lessonId },
      { questions },
      { new: true, runValidators: true },
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ success: true, data: quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { answers } = req.body;

    const quiz = await Quiz.findOne({ lesson: lessonId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers required" });
    }

    let score = 0;

    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score++;
      }
    });

    const percentage = (score / quiz.questions.length) * 100;

    res.json({
      success: true,
      score,
      total: quiz.questions.length,
      percentage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
