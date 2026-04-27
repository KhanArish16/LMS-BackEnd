import app from "./app.js";
import connectDB from "./config/db.js";
import http from "http";
import { initSocket } from "./socket.js";

if (process.env.NODE_ENV !== "production") {
  const { default: dotenv } = await import("dotenv");
  dotenv.config();
}

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

connectDB();
initSocket(server);
