import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reciver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    messages: String,

    conversationId: String,
  },
  { timestamps: true },
);

export default mongoose.model("Message", messageSchema);
