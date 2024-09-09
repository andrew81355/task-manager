import express from "express";
import taskRouter from "./routes/task-controllers.js";
import resourceRouter from "./routes/resource-controller.js"
import mongoose from "mongoose";


const app = express();
app.use(express.json());
app.use('/tasks', taskRouter);
app.use('/resources', resourceRouter);

if (process.env.NODE_ENV !== 'test') {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {});
        console.log('connected to mongodb');

        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (err) {
        console.log(err);
    }
}

export default app;

