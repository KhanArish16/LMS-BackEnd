import { Server } from "socket.io";
import Message from "./models/messages.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("sendMessage", async (data) => {
      const { sender, receiver, message } = data;

      const conversationId = [sender, receiver].sort().join("_");

      const savedMessage = await Message.create({
        sender,
        receiver,
        message,
        conversationId,
      });

      io.to(receiver).emit("receiveMessage", savedMessage);
      io.to(sender).emit("receiveMessage", savedMessage);
    });
  });
};
