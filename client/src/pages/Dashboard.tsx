import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import DashboardLayout from "../Components/DashboardLayout";
import { useState, useEffect } from "react";
import projectApi from "../api/projectapi";

import API from "../api/api";

interface Project {
  _id: string;
  name: string;
  progress: number;
  tasks: number;
}

function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<string[]>([]);

  const totalMembers = new Set(
  projects.flatMap((project: any) => project.members || [])
).size;

useEffect(() => {
  const fetchMembers = async () => {
    try {
      const res = await projectApi.get("/members");
      setMembers(res.data || []);
    } catch (err) {
      console.error("Dashboard members error:", err);
      setMembers([]); 
    }
  };

  fetchMembers();
}, []);

  const stats = [
  ["Total Projects", data?.totalProjects],
  ["Total Tasks", data?.totalTasks],
  ["Completed Tasks", data?.completedTasks],
  ["Running Tasks", data?.runningTasks],
  ["Pending Tasks", data?.pendingTasks],
  ["Team Members", totalMembers],
];

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
     const [summaryRes, projectsRes] = await Promise.all([
  API.get("/dashboard/summary"),
  projectApi.get("/"),
]);

setData(summaryRes.data);
setProjects(projectsRes.data);
console.log("PROJECTS:", projectsRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);

    

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Loading...">
        Loading...
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back to TaskHub"
    >
      <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {stats.map(([title, value]) => (
          <div
            key={String(title)}
            className="bg-white rounded-3xl p-6 shadow-sm"
          >
            <p className="text-slate-500 font-medium">{title}</p>
            <h4 className="text-4xl font-bold text-blue-800 mt-3">
              {value ?? 0}
            </h4>
          </div>
        ))}
      </section>

      <section className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Projects Analytics
            </h3>

            <span className="text-sm bg-blue-50 text-[#0b46bc] px-3 py-1 rounded-full font-semibold">
              Live
            </span>
          </div>

          <div className="h-72 bg-blue-50 rounded-3xl flex items-end gap-4 p-6">
            {projects.slice(0, 6).map((project) => (
              <div
                key={project._id}
                className="flex-1 bg-[#0b46bc] rounded-t-2xl"
                style={{ height: `${project.progress || 0}%` }}
                title={`${project.name}: ${project.progress}%`}
              />
            ))}
          </div>
        </div>
<section className="bg-white rounded-3xl p-6 shadow-sm mt-6">
  <div className="flex flex-col gap-3">
    
    <h3 className="font-bold text-black text-lg">
      Team Members Working In Ongoing Projects
    </h3>

    {members.map((name, index) => (
      <span
        key={index}
        className="inline-flex w-fit px-3 py-1  bg-blue-100 text-[#0b46bc] rounded-full text-sm font-semibold"
      >
        {name}
      </span>
    ))}
  </div>
</section>

        
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm mt-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-slate-900">
            Recent Projects
          </h3>

          <Link
            to="/projects"
            className="bg-[#0b46bc] text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {projects.slice(0, 3).map((project) => (
            <div
              key={project._id}
              className="border border-slate-200 rounded-2xl p-5"
            >
              <h4 className="font-bold text-slate-900">
                {project.name}
              </h4>

              <p className="text-sm text-slate-500 mt-2">
                {project.progress}% complete - {project.tasks} tasks
              </p>

              <Link
                to={`/projects/${project._id}/tasks`}
                className="inline-flex items-center gap-2 mt-4 text-[#0b46bc] font-semibold"
              >
                View Tasks
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Dashboard;