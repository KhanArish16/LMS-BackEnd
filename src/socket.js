import { Server } from "socket.io";
import Message from "./models/messages.js";
import Conversation from "./models/conversation.js";

export const initSocket = (server) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.CLIENT_URL,
  ].filter(Boolean);

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      try {
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

        io.to(senderId).emit("receiveMessage", populated);
        io.to(receiverId).emit("receiveMessage", populated);

        io.to(senderId).emit("conversationUpdated");
        io.to(receiverId).emit("conversationUpdated");
      } catch (err) {
        console.log("Socket error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
