const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const taskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

// Routes
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.get("/tasks/:id", async (req, res) => {
  const tasks = await Task.findById(req.params.id);
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const { title } = req.body;
  const newTask = new Task({ title });
  await newTask.save();
  res.status(201).json(newTask);
});

app.put("/tasks/:id", async (req, res) => {
  const putTasked = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(putTasked);
});

app.delete("/tasks/:id", async (req, res) => {
  const deleteTasked = await Task.findByIdAndDelete(req.params.id);
  if (deleteTasked) {
    res.json({ message: "Task deleted", task: deleteTasked });
  } else {
    res.status(404).json({ message: "Task deleted" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("http://localhost:3000/");
});
