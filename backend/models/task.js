import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["open", "in progress", "done"],
      default: "open",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);



// eslint-disable-next-line no-use-before-define
taskSchema.statics.build = (attrs) => (new Task(attrs));
const Task = mongoose.model("Task", taskSchema);

export { Task };
