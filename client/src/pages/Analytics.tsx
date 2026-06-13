import {
  CheckCircle,
  Clock,
  FolderKanban,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "../Components/DashboardLayout";
import { useEffect, useState } from "react";
import projectApi from "../api/projectapi";

function Analytics() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectApi.get("/");
        setProjects(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <DashboardLayout
        title="Analytics"
        subtitle="Loading analytics..."
      >
        Loading...
      </DashboardLayout>
    );
  }

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const pendingProjects = projects.filter(
    (project) => project.status === "Pending"
  ).length;

  const runningProjects = projects.filter(
    (project) => project.status === "Running"
  ).length;

  const totalTasks = projects.reduce(
    (sum, project) => sum + (project.tasks || 0),
    0
  );

  const averageProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce(
            (sum, project) => sum + (project.progress || 0),
            0
          ) / projects.length
        )
      : 0;

  const analyticsCards = [
    {
      title: "Total Projects",
      value: projects.length.toString(),
      icon: FolderKanban,
      color: "bg-blue-50 text-[#0b46bc]",
    },
    {
      title: "Completed Projects",
      value: completedProjects.toString(),
      icon: CheckCircle,
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Pending Projects",
      value: pendingProjects.toString(),
      icon: Clock,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      title: "Avg Progress",
      value: `${averageProgress}%`,
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Track project progress and team performance."
    >
      {/* TOP CARDS */}
      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {analyticsCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${card.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <p className="text-slate-500 font-medium">
                {card.title}
              </p>

              <h3 className="text-4xl font-bold text-slate-900 mt-3">
                {card.value}
              </h3>
            </div>
          );
        })}
      </section>

      {/* GRAPH + PROJECT PROGRESS */}
      <section className="grid xl:grid-cols-3 gap-6">
        

          

                
    

        {/* PROJECT PROGRESS */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Project Progress
          </h2>

          <div className="space-y-5">
            {projects.map((project) => (
              <div key={project._id}>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-slate-800">
                    {project.name}
                  </span>

                  <span className="font-bold text-[#0b46bc]">
                    {project.progress || 0}%
                  </span>
                </div>

                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0b46bc]"
                    style={{
                      width: `${project.progress || 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKLOAD */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mt-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Workload Summary
        </h2>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-sm text-slate-500">
              Total Tasks
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-1">
              {totalTasks}
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-sm text-slate-500">
              Running Projects
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-1">
              {runningProjects}
            </p>
          </div>

          

          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-1">
              {completedProjects}
            </p>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Analytics;