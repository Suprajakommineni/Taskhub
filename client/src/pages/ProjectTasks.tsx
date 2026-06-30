import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Plus,
  Users,
  Pencil,
  Trash2,
  X,
  
} from "lucide-react";

import DashboardLayout from "../Components/DashboardLayout";
import taskApi from "../api/taskapi";

type TaskStatus = "Pending" | "Running" | "Completed";
type TaskPriority = "Low" | "Medium" | "High";

interface Task {
  _id: string;
  name: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedTo?: string;
}

function ProjectTasks() {
  const { projectId } = useParams();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingTaskId, setEditingTaskId] =
    useState<string | null>(null);

  const [taskName, setTaskName] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [status, setStatus] =
    useState<TaskStatus>("Pending");
  const [priority, setPriority] =
    useState<TaskPriority>("Medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await taskApi.get(
        `/project/${projectId}`
      );

      setTasks(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTaskName("");
    setAssignedUser("");
    setStatus("Pending");
    setPriority("Medium");
    setDueDate("");
    setEditingTaskId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };
    const openEditModal = (task: Task) => {
    setEditingTaskId(task._id);
    setTaskName(task.name);
    setAssignedUser(task.assignedTo || "");
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(
      task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 10)
        : ""
    );

    setShowModal(true);
  };

  const saveTask = async () => {
    if (!taskName.trim()) {
      alert("Please enter task name.");
      return;
    }

    if (!dueDate) {
      alert("Please select due date.");
      return;
    }

    try {
      const payload = {
        name: taskName,
        assignedTo: assignedUser.trim(),
        status,
        priority,
        dueDate,
        project: projectId,
      };

      if (editingTaskId) {
        await taskApi.put(
          `/${editingTaskId}`,
          payload
        );
      } else {
        await taskApi.post(
          "/",
          payload
        );
      }

      await fetchTasks();

      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save task.");
    }
  };

  const deleteTask = async (taskId: string) => {
    const ok = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!ok) return;

    try {
      await taskApi.delete(`/${taskId}`);

      await fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete task.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Project Tasks"
        subtitle="Loading..."
      >
        Loading tasks...
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Project Tasks"
      subtitle="Manage all project tasks"
    >      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/projects"
          className="flex items-center gap-2 text-[#0b46bc] font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Projects
        </Link>

        <button
          onClick={openAddModal}
          className="bg-[#0b46bc] text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* TASKS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition"
          >
            {/* TOP */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {task.name}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Project task
                </p>
              </div>

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

            {/* PRIORITY */}
            <div className="mb-5">
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold ${
                  task.priority === "High"
                    ? "bg-red-100 text-red-700"
                    : task.priority === "Medium"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {task.priority} Priority
              </span>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <CalendarDays className="w-4 h-4" />
                  Due Date
                </div>

                <p className="font-bold text-slate-800">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "--"}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <Users className="w-4 h-4" />
                  Assigned
                </div>

                <p className="font-bold text-slate-800">
                  {task.assignedTo || "Unassigned"}
                </p>

                {task.assignedTo && (
                  <div className="flex mt-3">
                    <div
                      className="w-10 h-10 rounded-full bg-blue-100
                      text-[#0b46bc]
                      font-bold
                      flex
                      items-center
                      justify-center"
                    >
                      {task.assignedTo.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => openEditModal(task)}
                className="bg-blue-50 text-[#0b46bc] py-2.5 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>

              <button
                onClick={() => deleteTask(task._id)}
                className="bg-red-50 text-red-600 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingTaskId ? "Edit Task" : "New Task"}
              </h2>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">

              {/* TASK NAME */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Task Name
                </label>

                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Enter task name"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ASSIGNED USERNAME */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Assigned Username
                </label>

                <input
                  type="text"
                  value={assignedUser}
                  onChange={(e) => setAssignedUser(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* DUE DATE */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Due Date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* STATUS & PRIORITY */}
              <div className="grid sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>

                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as TaskStatus)
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Running">Running</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Priority
                  </label>

                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as TaskPriority)
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

              </div>

              {/* SAVE BUTTON */}
              <button
                type="button"
                onClick={saveTask}
                className="w-full bg-[#0b46bc] text-white py-3 rounded-2xl font-bold hover:bg-[#08379b] transition"
              >
                {editingTaskId ? "Update Task" : "Create Task"}
              </button>

            </div>
          </div>
        </div>
      )}</DashboardLayout>
      );
}

export default ProjectTasks;