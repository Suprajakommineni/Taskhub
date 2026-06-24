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
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [taskTitle, setTaskTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Pending");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [dueDate, setDueDate] = useState("");

  // FETCH TASKS
  const fetchTasks = async () => {
    if (!projectId) return;

    try {
      const res = await taskApi.get(`/project/${projectId}`);
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setTasks([]);
    }
  };

  // FETCH MEMBERS
  const fetchMembers = async () => {
    try {
      const res = await taskApi.get(`/project/${projectId}/members`);
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchTasks(), fetchMembers()]);
      setLoading(false);
    };
    init();
  }, [projectId]);

  const resetForm = () => {
    setTaskTitle("");
    setStatus("Pending");
    setPriority("Medium");
    setSelectedUserId("");
    setDueDate("");
    setEditingTaskId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTaskId(task._id);
    setTaskTitle(task.name);
    setStatus(task.status);
    setPriority(task.priority);
    setSelectedUserId(task.assignedTo?._id || "");
    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setShowModal(true);
  };

  const saveTask = async () => {
    try {
      const payload = {
        name: taskTitle.trim(),
        status,
        priority,
        project: projectId,
        assignedTo: selectedUserId || null,
        dueDate: dueDate ? new Date(dueDate) : new Date(),
      };

      if (editingTaskId) {
        const res = await taskApi.put(`/${editingTaskId}`, payload);
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTaskId ? res.data : t))
        );
      } else {
        const res = await taskApi.post("/", payload);
        setTasks((prev) => [...prev, res.data]);
      }

      await fetchTasks();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await taskApi.delete(`/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
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
    <DashboardLayout title="Project Tasks" subtitle="Manage tasks">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/tasks" className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>

        <button
          onClick={openAddModal}
          className="bg-[#0b46bc] text-white px-5 py-3 rounded-2xl flex gap-2"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* TASK LIST */}
      <div className="grid gap-5">
        {tasks.map((task) => (
          <div key={task._id} className="p-6 bg-white rounded-3xl">
            <h3 className="font-bold">{task.name}</h3>

            <div className="text-sm flex gap-3 mt-2">
              <span>
                <User className="inline w-4 h-4" />{" "}
                {task.assignedTo?.username || "Unassigned"}
              </span>

              <span>
                <Flag className="inline w-4 h-4" /> {task.priority}
              </span>
            </div>

            <p className="text-xs text-gray-400 mt-1">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No date"}
            </p>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-3">
              <button onClick={() => openEditModal(task)}>
                <Pencil />
              </button>

              <button onClick={() => deleteTask(task._id)}>
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl w-full max-w-lg">

            <div className="flex justify-between mb-4">
              <h2>{editingTaskId ? "Edit Task" : "New Task"}</h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <input
              placeholder="Task name"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full border p-3 mb-3"
            />

            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full border p-3 mb-3"
            >
              <option value="">Assign Member</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.username}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border p-3 mb-3"
            />

            <button
              onClick={saveTask}
              className="w-full bg-[#0b46bc] text-white p-3 rounded-2xl"
            >
              Save Task
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ProjectTasks;