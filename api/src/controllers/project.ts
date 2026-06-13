import { Request, Response } from "express";
import Project from "../models/projectmodel";
import Task from "../models/taskmodel";



export const createProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await Project.create({
      ...req.body,
      createdBy: userId,
    });

    res.status(201).json(project);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Create project failed",
      error: error.message,
    });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const projects = await Project.find({
      createdBy: userId,
    });

    // attach real task count
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
    console.error(error);
    res.status(500).json({
      message: "Project update failed",
      error: error.message,
    });
  }
};

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
    console.error(error);
    res.status(500).json({
      message: "Project delete failed",
      error: error.message,
    });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: userId,
    });

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

export const getProjectMembers = async (req: Request, res: Response) => {
  try {
    console.log("🔥 /members ROUTE HIT");

    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - no userId" });
    }

    // ✅ lean() prevents mongoose weird objects
    const projects = await Project.find({ createdBy: userId }).lean();

    console.log("PROJECTS FOUND:", projects.length);

    // ✅ SAFE extraction (no forEach crash risk)
    const members = projects.flatMap((p: any) => p.members ?? []);

    // remove duplicates
    const uniqueMembers = [...new Set(members)];

    return res.json(uniqueMembers);
  } catch (error: any) {
    console.error("🔥 MEMBERS ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error?.message,
    });
  }
};