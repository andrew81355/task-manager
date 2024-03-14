import express from "express";
import taskRouter from "./routes/task-controllers.js"; 
import mongoose from "mongoose";


const app = express();
app.use(express.json());
app.use('/tasks', taskRouter);

try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {});
    console.log('connected to mongodb');
} catch (err) {
    console.log(err);
}

app.listen(3000, () => {
    console.log('Server is running!!!!');
});
