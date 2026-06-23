import Task from "../models/taskmodel";
import Project from "../models/projectmodel";
import User from "../models/usersmodel";
import { Request, Response } from "express";

export const getDashboardSummary = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const totalProjects = await Project.countDocuments({
      createdBy: userId,
    });

    const totalTasks = await Task.countDocuments({
      createdBy: userId,
    });

    const completedTasks = await Task.countDocuments({
      createdBy: userId,
      status: "Completed",
    });

    const pendingTasks = await Task.countDocuments({
      createdBy: userId,
      status: "Pending",
    });

    const runningTasks = await Task.countDocuments({
  createdBy: userId,
  status: "Running",
});

    const tasks = await Task.find({
      createdBy: userId,
      assignedTo: { $ne: null },
    }).select("assignedTo");

    const memberIds = [
      ...new Set(
        tasks
          .map((t: any) => t.assignedTo?.toString())
          .filter(Boolean)
      ),
    ];

    const users = await User.find({
      _id: { $in: memberIds },
    }).select("username");

    const usernames = users.map((u) => u.username);

    res.json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      runningTasks,
      teamMembers: usernames,
    });
  } catch (err: any) {
    console.error("Dashboard Summary Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};