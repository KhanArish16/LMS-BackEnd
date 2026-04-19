import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["VIDEO", "ARTICLE", "QUIZ", "BLOG", "YOUTUBE"],
      required: true,
    },

    contentUrl: String,
    content: String,
    thumbnail: String,
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },

    category: {
      type: String,
      enum: ["DSA", "FRONTEND", "BACKEND", "FULLSTACK", "WEB"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Lesson", lessonSchema);
