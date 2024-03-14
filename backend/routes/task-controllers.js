import { Router } from "express";
import { Task } from "../models/task.js";

const router = Router();

router.get("/", async (req, res) => {
  const taskss = await Task.find({});
  res.json(taskss);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const task = await Task.findOne({ _id: id });
  if (!task) {
    return res.status(404).json({ message: "Not Found" });
  }
  return res.json(task);
});

router.post("/", async (req, res) => {
  const existingTask = await Task.find({ title: req.body.title });

  if (existingTask.length > 0) {
    return res.status(401).json({ message: "Task Exists" });
  }
  const newTask = Task.build(req.body);
  await newTask.save();

  res.status(201).json({message: 'ok'});
});

router.put("/:id", async (req, res) => {
    const {title, description, status} = req.body;

    await Task.findOneAndUpdate({_id: req.params.id}, {title, description, status})

    return res.status(200).json({message: "successful"});
});

router.delete("/:id", async (req, res) => {
    await Task.findOneAndDelete({_id: req.params.id});
    res.json({ message: "Task deleted successfully" });
});

export default router;
