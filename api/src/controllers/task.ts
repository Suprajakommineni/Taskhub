import { Request, Response } from "express";
import Task from "../models/taskmodel";
import Project from "../models/projectmodel";
import User from "../models/usersmodel";


export const createTask = async (req: any, res: Response) => {
  try {
    let assignedUser = null;

    if (req.body.assignedTo) {
      assignedUser = await User.findOne({
        username: req.body.assignedTo,
      });
    }

    const task = await Task.create({
      ...req.body,
      assignedTo: assignedUser?._id || null,
      createdBy: req.user.id,
    });

    await Project.findByIdAndUpdate(task.project, {
      $inc: { tasks: 1 },
    });

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name")
      .populate("assignedTo", "username");

    res.status(201).json(populatedTask);
  } catch (error: any) {
    console.error("CREATE TASK ERROR:", error);

    res.status(500).json({
      message: "Task creation failed",
      error: error.message,
    });
  }
};

  export const getTasks = async (req: any, res: Response) => {
    
  try {
  const tasks = await Task.find({
  createdBy: req.user.id,
  })
  .populate("project", "name")
  .populate("assignedTo", "username");
  
  console.log(tasks);
console.log("CURRENT USER:", req.user.id);

  res.json(tasks);
  } catch (error: any) {
  console.error("GET TASKS ERROR:", error);

  res.status(500).json({
  message: "Failed to fetch tasks",
  error: error.message,
  });
  }
  };

/**

* GET TASKS BY PROJECT
  */
  export const getTaskByProject = async (req: any, res: Response) => {
  try {
  const { projectId } = req.params;

  const tasks = await Task.find({
  project: projectId,
  createdBy: req.user.id,
  })
  .populate("project", "name")
  .populate("assignedTo", "username");

  res.json(tasks);
  } catch (error: any) {
  console.error("GET TASK BY PROJECT ERROR:", error);

  res.status(500).json({
  message: "Failed to fetch project tasks",
  });
  }
  };

/**

* UPDATE TASK
  */
  export const getTaskUpdate = async (req: any, res: Response) => {
  try {
  const task = await Task.findOneAndUpdate(
  {
  _id: req.params.id,
  createdBy: req.user.id,
  },
  req.body,
  {
  new: true,
  }
  );

  if (!task) {
  return res.status(404).json({
  message: "Task not found",
  });
  }

  res.json(task);
  } catch (error: any) {
  console.error("UPDATE TASK ERROR:", error);

  res.status(500).json({
  message: "Task update failed",
  error: error.message,
  });
  }
  };

/**

* DELETE TASK
  */
  export const getTaskDelete = async (req: any, res: Response) => {
  try {
  const task = await Task.findOne({
  _id: req.params.id,
  createdBy: req.user.id,
  });

  if (!task) {
  return res.status(404).json({
  message: "Task not found",
  });
  }

  await Task.findByIdAndDelete(task._id);

  await Project.findByIdAndUpdate(task.project, {
  $inc: { tasks: -1 },
  });

  res.json({
  message: "Task deleted successfully",
  });
  } catch (error: any) {
  console.error("DELETE TASK ERROR:", error);

  res.status(500).json({
  message: "Delete failed",
  error: error.message,
  });
  }
  };
