import cron from "node-cron";
import User from "../models/usermodel";
import Task from "../models/taskmodel";
import Project from "../models/projectmodel"; // adjust path if different
import transporter from "./mailer";
import { taskDueTemplate, projectDueTemplate } from "./emailTemplate";

export const startCronJobs = () => {

  // Runs every day at 8:00 AM
  cron.schedule("0 8 * * *", async () => {
    console.log("⏰ Running daily notification cron job...");

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const next7Days = new Date();
      next7Days.setDate(today.getDate() + 7);
      next7Days.setHours(23, 59, 59, 999);

      // Only users with email ON and at least one notification type ON
      const users = await User.find({
        "notificationPreferences.emailNotifications": { $ne: false },
        $or: [
          { "notificationPreferences.taskNotifications":    { $ne: false } },
          { "notificationPreferences.projectNotifications": { $ne: false } },
        ],
      });

      console.log(`📨 Checking notifications for ${users.length} users...`);

      for (const user of users) {
        const prefs = user.notificationPreferences as any;

        // Master switch — if email notifications OFF skip entirely
        if (prefs?.emailNotifications === false) continue;

        // ── Task notifications ───────────────────────────────────
        if (prefs?.taskNotifications !== false) {
          const dueTasks = await Task.find({
            createdBy: user._id,
            dueDate: { $gte: today, $lte: next7Days },
            status: { $ne: "Completed" },
          }).populate("project", "name");

          if (dueTasks.length > 0) {
            const template = taskDueTemplate(user.username, dueTasks);
            await transporter.sendMail({
              from: `"TaskHub" <${process.env.EMAIL_USER}>`,
              to: user.email,
              subject: template.subject,
              html: template.html,
            });
            console.log(`✅ Task reminder sent to ${user.email} (${dueTasks.length} tasks)`);
          }
        }

        // ── Project notifications ────────────────────────────────
        if (prefs?.projectNotifications !== false) {
          const dueProjects = await Project.find({
            createdBy: user._id,
            dueDate: { $gte: today, $lte: next7Days },
            status: { $ne: "Completed" },
          });

          if (dueProjects.length > 0) {
            const template = projectDueTemplate(user.username, dueProjects);
            await transporter.sendMail({
              from: `"TaskHub" <${process.env.EMAIL_USER}>`,
              to: user.email,
              subject: template.subject,
              html: template.html,
            });
            console.log(`✅ Project reminder sent to ${user.email} (${dueProjects.length} projects)`);
          }
        }
      }

      console.log("✅ Daily cron job complete.");
    } catch (err) {
      console.error("❌ Cron job failed:", err);
    }
  });

  console.log("⏰ Cron jobs scheduled.");
};