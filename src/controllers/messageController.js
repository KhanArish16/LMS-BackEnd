export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.userId;

    const conversationId = [userId, otherUserId].sort().join("_");

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$message" },
          updatedAt: { $first: "$createdAt" },
          sender: { $first: "$sender" },
          receiver: { $first: "$receiver" },
        },
      },
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
