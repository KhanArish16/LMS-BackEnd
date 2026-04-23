import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.error("MongoDB Error", err.message);
    });
};

export default connectDB;
