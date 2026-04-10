import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    category: {
      type: String,
      enum: [
        "DSA",
        "FRONTEND",
        "BACKEND",
        "FULLSTACK",
        "MOBILE",
        "DATA_SCIENCE",
        "AI_ML",
        "CYBER_SECURITY",
        "DEVOPS",
        "CLOUD_COMPUTING",
        "UI_UX",
        "OTHER",
      ],
    },

    level: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      default: "BEGINNER",
    },

    thumbnail: String,
  },
  { timestamps: true },
);

export default mongoose.model("Course", courseSchema);
