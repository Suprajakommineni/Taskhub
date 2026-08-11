import Task from "../models/taskmodel";
import Project from "../models/projectmodel"; // adjust path if different

export const getNotifications = async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);
    next7Days.setHours(23, 59, 59, 999);

    // Tasks due in next 7 days (not completed)
    const taskNotifications = await Task.find({
      createdBy: userId,
      dueDate: { $gte: today, $lte: next7Days },
      status: { $ne: "Completed" },
    }).populate("project", "name");

    // Projects due in next 7 days (not completed)
    const projectNotifications = await Project.find({
      createdBy: userId,
      dueDate: { $gte: today, $lte: next7Days },
      status: { $ne: "Completed" },
    });

    // Merge both into a unified notification shape
    const notifications = [
      ...taskNotifications.map((task: any) => ({
        _id: task._id,
        name: task.name,
        type: "task",
        dueDate: task.dueDate,
        status: task.status,
        project: task.project,
      })),
      ...projectNotifications.map((project: any) => ({
        _id: project._id,
        name: project.name,
        type: "project",
        dueDate: project.dueDate,
        status: project.status,
        project: null,
      })),
    ].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};