import Message from "../models/messages.js";
import Conversation from "../models/conversation.js";

/* ---------------- GET MESSAGES ---------------- */
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    const messages = await Message.find({ conversationId })
      .populate("sender", "name profilePic")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ---------------- GET CONVERSATIONS ---------------- */
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      members: userId,
    })
      .populate("members", "name profilePic")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !text) {
      return res.status(400).json({
        message: "receiverId and text required",
      });
    }

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      text,
    });

    conversation.lastMessage = text;
    await conversation.save();

    const populated = await message.populate("sender", "name profilePic");

    res.json({
      success: true,
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
