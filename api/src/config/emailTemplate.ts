export const taskDueTemplate = (username: string, tasks: any[]) => ({
  subject: "📋 TaskHub — Tasks Due Soon",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 24px; border-radius: 12px;">
      
      <div style="background: #0b46bc; padding: 24px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
        <h1 style="color: white; margin: 0; font-size: 24px;">TaskHub</h1>
        <p style="color: #bfdbfe; margin: 6px 0 0;">Task Reminder</p>
      </div>

      <p style="color: #334155; font-size: 16px;">Hi <strong>${username}</strong>,</p>
      <p style="color: #64748b;">You have <strong>${tasks.length}</strong> task(s) due in the next 7 days:</p>

      ${tasks.map((task) => `
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; color: #0f172a; font-size: 15px;">${task.name}</h3>
            <span style="background: ${
              task.priority === "High" ? "#fee2e2" :
              task.priority === "Medium" ? "#fef3c7" : "#dcfce7"
            }; color: ${
              task.priority === "High" ? "#dc2626" :
              task.priority === "Medium" ? "#d97706" : "#16a34a"
            }; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">
              ${task.priority}
            </span>
          </div>
          <p style="color: #64748b; font-size: 13px; margin: 8px 0 0;">
            📅 Due: <strong>${new Date(task.dueDate).toDateString()}</strong>
            ${task.project?.name ? ` &nbsp;·&nbsp; 📁 ${task.project.name}` : ""}
          </p>
        </div>
      `).join("")}

      <div style="margin-top: 24px; text-align: center;">
        <a href="http://localhost:5173/tasks" 
           style="background: #0b46bc; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
          View Tasks →
        </a>
      </div>

      <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
        You're receiving this because task notifications are enabled in your TaskHub settings.
      </p>
    </div>
  `,
});

export const projectDueTemplate = (username: string, projects: any[]) => ({
  subject: "📁 TaskHub — Projects Due Soon",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 24px; border-radius: 12px;">

      <div style="background: #0b46bc; padding: 24px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
        <h1 style="color: white; margin: 0; font-size: 24px;">TaskHub</h1>
        <p style="color: #bfdbfe; margin: 6px 0 0;">Project Reminder</p>
      </div>

      <p style="color: #334155; font-size: 16px;">Hi <strong>${username}</strong>,</p>
      <p style="color: #64748b;">You have <strong>${projects.length}</strong> project(s) due in the next 7 days:</p>

      ${projects.map((project) => `
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
          <h3 style="margin: 0; color: #0f172a; font-size: 15px;">${project.name}</h3>
          <p style="color: #64748b; font-size: 13px; margin: 8px 0 4px;">
            📅 Due: <strong>${new Date(project.dueDate).toDateString()}</strong>
          </p>
          <p style="color: #64748b; font-size: 13px; margin: 0;">
            📊 Progress: <strong>${project.progress ?? 0}%</strong> &nbsp;·&nbsp; Status: <strong>${project.status}</strong>
          </p>
        </div>
      `).join("")}

      <div style="margin-top: 24px; text-align: center;">
        <a href="http://localhost:5173/projects"
           style="background: #0b46bc; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
          View Projects →
        </a>
      </div>

      <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
        You're receiving this because project notifications are enabled in your TaskHub settings.
      </p>
    </div>
  `,
});