import "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import http from "http";
import { initSocket } from "./socket.js";

const PORT = 5000;

await connectDB();

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
