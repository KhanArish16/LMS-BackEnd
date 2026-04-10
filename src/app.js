import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/courses", courseRoutes);

export default app;
