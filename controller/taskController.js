// import ErrorHandler from "../middleware/error.js";

import { Task } from "../model/task.js";

export const newTask = async (req, res, next) => {
  try {
    //  fetch data for req
    const { title, description } = req.body;
    //validation
    if (!title || !description) {
      return res.status(204).json({
        success: false,
        message: "all field required",
      });
    }

    //create entry on db
    const task = await Task.create({
      title,
      description,
      user: req.user,
    });

    res.status(201).json({
      success: true,
      message: "Task added successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//handle for get task
export const getTaskDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    //find all the task in db
    const tasks = await Task.find({ user: userId });

    res.status(200).json({
      success: true,
      message: "all task fetched successfully!",
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//handle for update task
export const updateTask = async (req, res, next) => {
  try {
    const id = req.params.id;

    //find all the task in db
    const tasks = await Task.findById(id);
    // if (!tasks) return next(new ErrorHandler("Task Not Found", 404));

    tasks.isCompleted = !tasks.isCompleted;

    await tasks.save();

    res.status(200).json({
      success: true,
      message: " task updated successfully!",
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//handle for delete task

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    //find all the task in db
    const tasks = await Task.findById(id);

    if (!tasks) return next(new Error("Invalid ID"));

    await tasks.deleteOne();

    res.status(200).json({
      success: true,
      message: " task deleted successfully!",
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
