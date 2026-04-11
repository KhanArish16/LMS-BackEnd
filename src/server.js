import "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";

// console.log("ENV CHECK:", process.env.CLOUD_NAME);

const PORT = 5000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
