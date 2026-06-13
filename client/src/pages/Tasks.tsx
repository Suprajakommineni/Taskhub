import {Link} from "react-router-dom"
import { ArrowRight, ClipboardList } from "lucide-react";
import DashboardLayout from "../Components/DashboardLayout";
import { useEffect, useState } from "react";
import taskApi from "../api/taskapi";

function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await taskApi.get("/"); // ✅ GET ALL TASKS
        setTasks(res.data);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Tasks" subtitle="Loading...">
        Loading tasks...
      </DashboardLayout>
    );
  }
console.log(tasks)
  return (
    <DashboardLayout
      title="Tasks"
      subtitle="All tasks from all projects."
    >
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        {tasks.map((task: any) => (
          <div
            key={task._id}
            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition"
          >
            {/* ICON */}
            <div className="w-12 h-12 bg-blue-50 text-[#0b46bc] rounded-2xl flex items-center justify-center mb-5">
              <ClipboardList className="w-6 h-6" />
            </div>

            {/* TASK NAME + STATUS */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {task.name}
              </h2>

              <span
                className={`text-xs px-3 py-1 rounded-full font-bold ${
                  task.status === "Running"
                    ? "bg-green-100 text-green-700"
                    : task.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-[#0b46bc]"
                }`}
              >
                {task.status}
              </span>
            </div>

            {/* PRIORITY + DATE */}
            <p className="text-sm text-slate-500 mb-5">
              Priority: {task.priority} • Due:{" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No date"}
            </p>

            {/* PROJECT INFO */}
            <p className="text-xs text-slate-400 mb-5">
              Project: {task.project?.name || "Unknown"}
            </p>

            {/* PROGRESS BAR (STATIC OR OPTIONAL) */}
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-[#0b46bc] rounded-full"
                style={{
                  width:
                    task.status === "Completed"
                      ? "100%"
                      : task.status === "Running"
                      ? "60%"
                      : "20%",
                }}
              />
            </div>

            {/* ACTION */}
            <div className="flex items-center justify-between text-[#0b46bc] font-bold">
              <span>Open Task</span>
              <Link to = "/projects/:projectId/tasks">
              <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}

      </div>
    </DashboardLayout>
  );
}

export default Tasks;