import { Request, Response } from "express";
import Task from "../models/taskmodel";
import Project from "../models/projectmodel";
import User from "../models/usermodel";

export const createTask = async (req: any, res: Response) => {
  try {
    let assignedUser = null;

    if (req.body.assignedTo) {
      assignedUser = await User.findOne({
        username: req.body.assignedTo.trim(),
      });

      console.log("Username entered:", req.body.assignedTo);
      console.log("ASSIGNED USER FOUND:", assignedUser);
    }

    const userId: string | undefined = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = await Task.create({
      ...req.body,
      assignedTo: assignedUser?._id || null,
      createdBy: userId,
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
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tasks = await Task.find({
      createdBy: userId,
    })
      .populate("project", "name")
      .populate("assignedTo", "username");

    console.log("TASKS:", tasks);
    console.log("CURRENT USER:", userId);

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
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { projectId } = req.params;

    const tasks = await Task.find({
      project: projectId,
      createdBy: userId,
    })
      .populate("project", "name")
      .populate("assignedTo", "username");

    res.json(tasks);
    console.log("TASKS FROM DB:", tasks);
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
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: userId,
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
export const getProjectMembers = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      createdBy: userId,
    }).populate("members", "username email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project.members);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch project members",
      error: error.message,
    });
  }
};