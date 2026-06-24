import { Request, Response } from "express";
import Project from "../models/projectmodel";
import Task from "../models/taskmodel";
import User from "../models/usermodel";

/**
 * CREATE PROJECT
 */
export const createTask = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = await Task.create({
      ...req.body,
      assignedTo: req.body.assignedTo || null, // ✅ directly store userId
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
/**
 * GET ALL PROJECTS
 */
export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const projects = await Project.find({
      createdBy: userId,
    });

    const projectsWithTaskCount = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({
          project: project._id,
        });

        return {
          ...project.toObject(),
          tasks: taskCount,
        };
      })
    );

    res.json(projectsWithTaskCount);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
};

/**
 * GET PROJECT BY ID (🔥 FIXED - POPULATE MEMBERS)
 */
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: userId,
    }).populate("members", "username email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching project",
      error: error.message,
    });
  }
};

/**
 * UPDATE PROJECT
 */
export const getProjectUpdate = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, createdBy: userId },
      req.body,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error: any) {
    res.status(500).json({
      message: "Project update failed",
      error: error.message,
    });
  }
};

/**
 * DELETE PROJECT
 */
export const getProjectDelete = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      createdBy: userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: "Project delete failed",
      error: error.message,
    });
  }
};

/**
 * GET PROJECT MEMBERS (FIXED & CLEAN)
 */
export const getProjectMembers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const projects = await Project.find({ createdBy: userId })
      .populate("members", "username email")
      .lean();

    const members = projects.flatMap((p: any) => p.members || []);

    // remove duplicates properly
    const uniqueMembers = Array.from(
      new Map(members.map((m: any) => [m._id.toString(), m])).values()
    );

    res.json(uniqueMembers);
  } catch (error: any) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};