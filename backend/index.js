import "dotenv/config";
import express from "express";
import taskRouter from "./routes/task-controllers.js";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.js";
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());    

app.use(
  cors({
    // Allow Vue dev server
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/tasks", taskRouter);
app.use("/auth", authRouter);

async function start() {
  const mongoUri = process.env.MONGO_URI;
  const port = Number(process.env.PORT ?? 3000);

  if (!mongoUri) {
    /* eslint-disable no-console */
    console.error("MONGO_URI is not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err?.message || err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  start();
}

export default app;
