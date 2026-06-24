import { Request, Response } from "express";
import Project from "../models/projectmodel";
import Task from "../models/taskmodel";

/**
 * CREATE PROJECT
 */
export const createProject = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const project = await Project.create({
      ...req.body,
      createdBy: userId,
      members: req.body.members || [],
    });

    res.status(201).json(project);
  } catch (error: any) {
    console.error("CREATE PROJECT ERROR:", error);
    res.status(500).json({
      message: "Create project failed",
      error: error.message,
    });
  }
};

/**
 * GET PROJECTS
 */
export const getProjects = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    const projects = await Project.find({
      $or: [{ createdBy: userId }, { members: userId }],
    });

    const result = await Promise.all(
      projects.map(async (p: any) => {
        const count = await Task.countDocuments({ project: p._id });
        return { ...p.toObject(), tasks: count };
      })
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

/**
 * GET PROJECT BY ID
 */
export const getProjectById = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ createdBy: userId }, { members: userId }],
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
 * UPDATE PROJECT (FIXED - SAFE UPDATE)
 */
export const getProjectUpdate = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    const updateData = {
      ...req.body,
    };

    delete updateData.createdBy;

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: userId,
      },
      updateData,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error: any) {
    console.error("PROJECT UPDATE ERROR:", error);
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
 * GET PROJECT MEMBERS (FULLY SAFE)
 */
export const getProjectMembers = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    const projects = await Project.find({
      createdBy: userId,
    })
      .populate("members", "username email")
      .lean();

    const members = projects.flatMap((p: any) =>
      Array.isArray(p.members) ? p.members : []
    );

    const uniqueMembers = [
      ...new Map(
        members
          .filter((m: any) => m?._id)
          .map((m: any) => [m._id.toString(), m])
      ).values(),
    ];

    res.json(uniqueMembers);
  } catch (error: any) {
    console.error("MEMBERS ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};