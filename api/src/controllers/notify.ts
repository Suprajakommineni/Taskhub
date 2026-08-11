import User from "../models/usermodel"; // adjust path

// GET /api/users/me/notification-preferences
export const getNotificationPreferences = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id).select("notificationPreferences");
    if (!user) return res.status(404).json({ message: "User not found" });

    const prefs = user.notificationPreferences as any;

    res.json({
      emailNotifications:   prefs?.emailNotifications   ?? true,
      taskNotifications:    prefs?.taskNotifications    ?? true,
      projectNotifications: prefs?.projectNotifications ?? true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch preferences" });
  }
};

// PUT /api/users/me/notification-preferences
export const updateNotificationPreferences = async (req: any, res: any) => {
  try {
    const { emailNotifications, taskNotifications, projectNotifications } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          "notificationPreferences.emailNotifications": emailNotifications,
          "notificationPreferences.taskNotifications": taskNotifications,
          "notificationPreferences.projectNotifications": projectNotifications,
        },
      },
      { returnDocument: 'after', select: "notificationPreferences" }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.notificationPreferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update preferences" });
  }
};