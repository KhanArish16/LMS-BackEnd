import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      enum: ["DSA", "FRONTEND", "BACKEND", "FULLSTACK", "GENERAL"],
      default: "GENERAL",
    },

    tags: [String],

    content: [
      {
        type: {
          type: String,
          enum: ["TEXT", "CODE", "IMAGE", "YOUTUBE", "LINK"],
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
        language: String,
      },
    ],

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Blog", blogSchema);
