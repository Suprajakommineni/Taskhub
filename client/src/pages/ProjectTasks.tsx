import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Pencil,
  X,
  User,
  Flag,
} from "lucide-react";

import DashboardLayout from "../Components/DashboardLayout";
import taskApi from "../api/taskapi";

type TaskStatus = "Pending" | "Running" | "Completed";
type TaskPriority = "Low" | "Medium" | "High";

type Task = {
  _id: string;
  name: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedTo?: {
    _id: string;
    username: string;
  } | null;
};

function ProjectTasks() {
  const { projectId } = useParams();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [taskTitle, setTaskTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Pending");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [assignedToName, setAssignedToName] = useState("");
  const [dueDate, setDueDate] = useState("");

  // FETCH TASKS
  const fetchTasks = async () => {
  if (!projectId) return;

  try {
    const res = await taskApi.get(`api/projects/${projectId}`);

    console.log("PROJECT ID:", projectId);
    console.log("TASK API RESPONSE:", res.data);

    setTasks(
      Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.tasks)
        ? res.data.tasks
        : []
    );
  } catch (error) {
    console.error("FETCH TASKS ERROR:", error);
  }
};

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchTasks();
      setLoading(false);
    };

    init();
  }, [projectId]);

  const resetForm = () => {
    setTaskTitle("");
    setStatus("Pending");
    setPriority("Medium");
    setAssignedToName("");
    setDueDate("");
    setEditingTaskId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // ✅ FIXED SAVE TASK (NO 400/500)
  const saveTask = async () => {
    try {
      if (!projectId) {
        alert("Project ID missing");
        return;
      }

      if (!taskTitle.trim()) {
        alert("Task name required");
        return;
      }

      const payload = {
        name: taskTitle.trim(),
        status,
        priority,
        project: projectId,

        // IMPORTANT: backend expects ObjectId (keep null for now)
        assignedTo: null,

        // SAFE dueDate handling
        dueDate: dueDate ? new Date(dueDate) : new Date(),
      };

      if (editingTaskId) {
        await taskApi.put(`/api/tasks/${editingTaskId}`, payload);
      } else {
        await taskApi.post("/api/tasks", payload);
      }

      await fetchTasks();
      resetForm();
      setShowModal(false);
    } catch (error: any) {
      console.error("TASK ERROR:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Task failed");
    }
  };

  const editTask = (task: Task) => {
    setEditingTaskId(task._id);
    setTaskTitle(task.name);
    setStatus(task.status);
    setPriority(task.priority);
    setAssignedToName(task.assignedTo?.username || "");
    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setShowModal(true);
  };

  const deleteTask = async (taskId: string) => {
    try {
      await taskApi.delete(`/api/tasks/${taskId}`);
      await fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Project Tasks" subtitle="Loading...">
        Loading...
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Project Tasks"
      subtitle="Manage tasks for this project"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/tasks"
          className="flex items-center gap-2 text-slate-600 hover:text-[#0b46bc]"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>

        <button
          onClick={openAddModal}
          className="bg-[#0b46bc] text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-[#0334ac]"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-slate-500">Total Tasks</p>
          <h2 className="text-2xl font-bold">{tasks.length}</h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-slate-500">Completed</p>
          <h2 className="text-2xl font-bold">
            {(Array.isArray(tasks) ? tasks : []).filter(
  (t) => t.status === "Completed"
).length}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-slate-500">Running</p>
          <h2 className="text-2xl font-bold">
            {(Array.isArray(tasks) ? tasks : []).filter(
  (t) => t.status !== "Completed"
).length}
          </h2>
        </div>
      </div>

      {/* TASK LIST */}
      <div className="grid gap-5">
        {(Array.isArray(tasks) ? tasks : []).map((task) => (
          <div
            key={task._id}
            className="bg-white rounded-3xl shadow-sm hover:shadow-md transition p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {task.name}
              </h3>

              <div className="flex gap-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {task.assignedTo?.username || "Unassigned"}
                </span>

                <span className="flex items-center gap-1">
                  <Flag className="w-4 h-4" />
                  {task.priority}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-1">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No date"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  task.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : task.status === "Running"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {task.status}
              </span>

              <button
                onClick={() => editTask(task)}
                className="p-2 bg-blue-50 rounded-xl text-[#0b46bc]"
              >
                <Pencil className="w-4 h-4" />
              </button>

              <button
                onClick={() => deleteTask(task._id)}
                className="p-2 bg-red-50 rounded-xl text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL (PROJECT STYLE FIXED) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6">

            {/* HEADER */}
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingTaskId ? "Edit Task" : "New Task"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM */}
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-4 py-3 border rounded-2xl mb-3"
              placeholder="Task name"
            />

            <input
              value={assignedToName}
              onChange={(e) => setAssignedToName(e.target.value)}
              className="w-full px-4 py-3 border rounded-2xl mb-3"
              placeholder="Assign to username"
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border rounded-2xl mb-3"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-4 py-3 border rounded-2xl mb-3"
            >
              <option value="Pending">Pending</option>
              <option value="Running">Running</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-4 py-3 border rounded-2xl mb-4"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <button
              onClick={saveTask}
              className="w-full bg-[#0b46bc] text-white py-3 rounded-2xl font-bold hover:bg-[#0334ac]"
            >
              {editingTaskId ? "Update Task" : "Create Task"}
            </button>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ProjectTasks;