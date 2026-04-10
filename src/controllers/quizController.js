import Quiz from "../models/quiz.js";
import Lesson from "../models/lesson.js";

export const createQuiz = async (req, res) => {
  try {
    const { lessonId, questions } = req.body;

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (lesson.type !== "QUIZ") {
      return res.status(400).json({ message: "Lesson is not Quiz Type" });
    }

    const quiz = await Quiz.create({
      lesson: lessonId,
      questions,
    });

    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const quiz = await Quiz.findOne({ lesson: lessonId });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    let score = 0;

    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score++;
      }
    });

    res.json({ score, total: quiz.questions.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
