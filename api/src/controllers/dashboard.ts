import Task from "../models/taskmodel";
import Project from "../models/projectmodel";
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

    // Get all assigned usernames
    const assignedTasks = await Task.find({
      createdBy: userId,
      assignedTo: { $exists: true, $ne: "" },
    }).select("assignedTo");

    // Remove duplicate usernames
    const teamMembers = [
      ...new Set(
        assignedTasks
          .map((task: any) => task.assignedTo?.trim())
          .filter(Boolean)
      ),
    ];

    res.status(200).json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      runningTasks,
      teamMembers,
    });
  } catch (error: any) {
    console.error("Dashboard Summary Error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
};