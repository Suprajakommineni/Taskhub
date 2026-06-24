import { Request, Response } from "express";
import Project from "../models/projectmodel";
import Task from "../models/taskmodel";

/**
 * CREATE PROJECT
 */
export const createProject = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await Project.create({
      ...req.body,
      createdBy: userId,
    });

    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({
      message: "Create project failed",
      error: error.message,
    });
  }
};

/**
 * GET ALL PROJECTS
 */
export const getProjects = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    const projects = await Project.find({ createdBy: userId });

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
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
};

/**
 * GET PROJECT BY ID (WITH MEMBERS)
 */
export const getProjectById = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

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
export const getProjectUpdate = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

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
export const getProjectDelete = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

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
 * GET PROJECT MEMBERS (SAFE + CLEAN)
 */
export const getProjectMembers = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const projects = await Project.find({ createdBy: userId })
      .populate("members", "username email")
      .lean();

    const members = (projects || []).flatMap(
      (p: any) => p.members || []
    );

    const uniqueMembers = Array.from(
      new Map(
        members.map((m: any) => [m._id.toString(), m])
      ).values()
    );

    res.json(uniqueMembers);
  } catch (error: any) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};