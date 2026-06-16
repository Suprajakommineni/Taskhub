import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {ArrowRight,CalendarDays,Plus,Users,X,Pencil,Trash2,} from "lucide-react";
import DashboardLayout from "../Components/DashboardLayout";
import projectApi from "../api/projectapi";
import {type Project, type ProjectStatus, type Priority} from "../data/mockdata";

interface BackendProject {
  _id?: string;
  id?: string;
  name: string;
  status?: string;
  priority?: string;
  progress?: number;
  tasks?: number;
  dueDate?: string;
  members?: string[];
}

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  const [status, setStatus] = useState<ProjectStatus>("Running");
  const [priority, setPriority] = useState<Priority>("Medium");
  
const [membersInput, setMembersInput] = useState("");

  


useEffect(() => {
  fetchProjects();
  
}, []);

const mapProject = (project: BackendProject): Project => ({
  id: project._id ?? project.id ?? "",
  name: project.name ?? "",
  status: (project.status ?? "Pending") as ProjectStatus,
  priority: (project.priority ?? "Medium") as Priority,
  progress: Number(project.progress ?? 0),
  tasks: Number(project.tasks ?? 0),
  dueDate: project.dueDate
    ? new Date(project.dueDate).toISOString().slice(0, 10)
    : "",
  members: project.members ?? [],
});

const fetchProjects = async () => {
  try {
    const res = await projectApi.get("/api/projects");
    
    setProjects(res.data.map(mapProject));
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
if (loading) {
  return (
    <DashboardLayout
      title="Projects"
      subtitle="Loading..."
    >
      Loading projects...
    </DashboardLayout>
  );
}

  const resetForm = () => {
  setProjectName("");
  setDueDate("");
  setMembersInput("");
  setStatus("Pending");
  setPriority("Medium");
  setEditingProjectId(null);
};

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const saveProject = async () => {
    if (!projectName.trim()) {
      alert("Please enter project name");
      return;
    }

    if (!dueDate.trim()) {
      alert("Please select due date");
      return;
    }

    

    try {
      const payload = {
  name: projectName,
  dueDate,
  members: membersInput
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean),
  status,
  priority,
  progress:
    status === "Completed"
      ? 100
      : status === "Running"
      ? 25
      : 0,
};
      if (editingProjectId) {
        await projectApi.put(`/${editingProjectId}`, payload);
      } else {
        await projectApi.post("/", payload);
      }

      await fetchProjects();
    } catch (error) {
      console.error("Failed to save project", error);
      alert("Failed to save project. Please try again.");
      return;
    }

    resetForm();
    setShowModal(false);
  };

  const editProject = (project: Project) => {
  setEditingProjectId(project.id);
  setProjectName(project.name);
  setDueDate(project.dueDate);
  setMembersInput(project.members.join(", "));
  setStatus(project.status);
  setPriority(project.priority);
  setShowModal(true);
};
  const deleteProject = async (projectId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      await projectApi.delete(`/${projectId}`);
      await fetchProjects();
    } catch (error) {
      console.error("Failed to delete project", error);
      alert("Failed to delete project. Please try again.");
    }
  };

  
  
  return (
    <DashboardLayout
      title="Projects"
      subtitle="View all projects and track progress."
    >
      <div className="flex justify-end mb-6">
        <button
          type="button"
          onClick={openAddModal}
          className="bg-[#0b46bc] text-white px-5 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {project.name}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Project workspace and task progress
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-bold ${
                  project.status === "Running"
                    ? "bg-green-100 text-green-700"
                    : project.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-[#0b46bc]"
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold ${
                  project.priority === "High"
                    ? "bg-red-100 text-red-700"
                    : project.priority === "Medium"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {project.priority} Priority
              </span>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500">Progress</span>
                <span className="font-bold text-slate-800">
                  {project.progress}%
                </span>
              </div>

              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0b46bc] rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <CalendarDays className="w-4 h-4" />
                  Due Date
                </div>
                <p className="font-bold text-slate-800">{new Date(project.dueDate).toLocaleDateString()}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <Users className="w-4 h-4" />
                  Team
                </div>

                <p className="font-bold text-slate-800">
                  {project.members.length} Members
                </p>

                <div className="flex -space-x-2 mt-3">
                  {project.members.slice(0, 3).map((member, index) => (
  <div
    key={index}
    title={member}
    className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white text-[#0b46bc] flex items-center justify-center text-sm font-bold"
  >
    {member.charAt(0).toUpperCase()}
  </div>
))}
                  {project.members.length > 3 && (
                    <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white text-slate-600 flex items-center justify-center text-sm font-bold">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-900">
                  {project.tasks}
                </span>{" "}
                tasks
              </p>

              <Link
                to={`/projects/${project.id}/tasks`}
                className="flex items-center gap-2 text-[#0b46bc] font-bold"
              >
                View Tasks
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                type="button"
                onClick={() => editProject(project)}
                className="bg-blue-50 text-[#0b46bc] py-2.5 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>

              <button
                type="button"
                onClick={() => deleteProject(project.id)}
                className="bg-red-50 text-red-600 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingProjectId ? "Edit Project" : "New Project"}
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
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Project Name
                </label>
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Due Date
                </label>
                <input
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  type="date"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Team Members
                </label>
               <input
  type="text"
  value={membersInput}
  onChange={(e) => setMembersInput(e.target.value)}
  placeholder="Enter usernames separated by commas"
  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as Project["status"])
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
                      setPriority(e.target.value as Project["priority"])
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={saveProject}
                className="w-full bg-[#0b46bc] text-white py-3 rounded-2xl font-bold hover:bg-[#0334ac]"
              >
                {editingProjectId ? "Update Project" : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Projects;