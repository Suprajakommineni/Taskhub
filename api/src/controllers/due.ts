import Task from "../models/taskmodel";

export const getNotifications = async (req: any, res: any) => {
  try {
    console.log("USER:", req.user.id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);
    next7Days.setHours(23, 59, 59, 999);

    console.log("TODAY:", today);
    console.log("NEXT:", next7Days);

    const tasks = await Task.find({
      createdBy: req.user.id,
      dueDate: {
        $gte: today,
        $lte: next7Days,
      },
      status: { $ne: "Completed" },
    });

    console.log("FOUND TASKS:", tasks);

    res.json(tasks);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
};