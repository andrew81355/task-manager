import express from "express";
import taskRouter from "./routes/task-controllers.js";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(
  cors({
    // Allow Vue dev server
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/tasks", taskRouter);

if (process.env.NODE_ENV !== "test") {
  try {
    mongoose.connect(process.env.MONGO_URI, {});
    /* eslint-disable no-console */
    console.log("connected to mongodb");

    app.listen(3000, () => {
      /* eslint-disable no-console */
      console.log("Server is running on port 3000");
    });
  } catch (err) {
    console.log(err);
  }
}

export default app;
