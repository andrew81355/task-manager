import mongoose from "mongoose";


const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['open', 'in progress', 'done'],
        default: 'open'
    } 
});


const Task = mongoose.model('Task', taskSchema);

export {Task};