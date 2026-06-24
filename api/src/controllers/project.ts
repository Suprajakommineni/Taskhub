import { Request, Response } from "express";
import Project from "../models/projectmodel";
import Task from "../models/taskmodel";
import User from "../models/usermodel";

/**
 * CREATE PROJECT
 */
export const createProject = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let memberIds: any[] = [];

    if (req.body.members?.length) {
      const users = await User.find({
        username: { $in: req.body.members }
      });

      memberIds = users.map(user => user._id);
    }

    const project = await Project.create({
      ...req.body,
      members: memberIds,
      createdBy: userId,
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

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (req.body.members) {
      const users = await User.find({
        username: { $in: req.body.members }
      });

      req.body.members = users.map(user => user._id);
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
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

    const members = projects.flatMap(
      (project: any) => Array.isArray(project.members)
        ? project.members
        : []
    );

    const uniqueMembers = Array.from(
      new Map(
        members.map((member: any) => [
          member._id.toString(),
          member,
        ])
      ).values()
    );

    res.json(uniqueMembers);
  } catch (error: any) {
    console.error("GET PROJECT MEMBERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch members",
      error: error.message,
    });
  }
};