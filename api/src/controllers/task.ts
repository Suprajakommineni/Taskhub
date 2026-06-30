import { Request, Response } from "express";
import Task from "../models/taskmodel";
import Project from "../models/projectmodel";

export const getProjectMembers = async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project.members || []);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * CREATE TASK
 */
export const createTask = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const task = await Task.create({
      name: req.body.name,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate || null,
      project: req.body.project,
      assignedTo: req.body.assignedTo || null,
      createdBy: userId,
    });

    await Project.findByIdAndUpdate(task.project, {
      $inc: { tasks: 1 },
    });

    const createdTask = await Task.findById(task._id)
  .populate("project", "name");

res.status(201).json(createdTask);
  } catch (error: any) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({
      message: "Task creation failed",
      error: error.message,
    });
  }
};

/**
 * GET ALL TASKS (USER)
 */
export const getTasks = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    const tasks = await Task.find({
  createdBy: userId,
}).populate("project", "name");
res.json(tasks);
  } catch (error: any) {
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
    const userId = req.user?.id;
    const { projectId } = req.params;

    const tasks = await Task.find({
  project: projectId,
  createdBy: userId,
});

    res.json(tasks);
  } catch (error: any) {
    console.error(error);
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
    const userId = req.user?.id;

    const task = await Task.findOneAndUpdate(
  {
    _id: req.params.id,
    createdBy: userId,
  },
  req.body,
  {
    new: true,
  }
);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error: any) {
    console.error(error);
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
    const userId = req.user?.id;

    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(task._id);

    await Project.findByIdAndUpdate(task.project, {
      $inc: { tasks: -1 },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};

/**
 * GET PROJECT MEMBERS (FIXED FOR YOUR ROUTE)
 */
