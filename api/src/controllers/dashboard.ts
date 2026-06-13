import Task from "../models/taskmodel";
import Project from "../models/projectmodel";
import User from "../models/usersmodel";
import { Request, Response } from "express";

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const totalProjects = await Project.countDocuments({ createdBy: userId });

    const totalTasks = await Task.countDocuments({ createdBy: userId });

    const completedTasks = await Task.countDocuments({
      createdBy: userId,
      status: "Completed",
    });

    const pendingTasks = await Task.countDocuments({
      createdBy: userId,
      status: "Pending",
    });

    // STEP 1: get assigned user IDs safely
    const tasks = await Task.find({
      createdBy: userId,
      assignedTo: { $ne: null },
    }).select("assignedTo");

    const memberIds = tasks.map((t) => t.assignedTo);

    // STEP 2: get usernames
    const users = await User.find({
      _id: { $in: memberIds },
    }).select("username");

    const usernames = users.map((u) => u.username);

    res.json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      teamMembers: usernames, // ✅ ONLY USERNAMES
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

