import express from "express";
import taskRouter from "./routes/task-controllers.js"; 


const app = express();
app.use(express.json());
app.use('/tasks', taskRouter);



app.listen(3000, () => {
    console.log('Server is running!!!!');
});
