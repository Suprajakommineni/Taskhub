import { useSearch } from "../Components/Search";
import { type ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Search,
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Users,
  LogOut,
  Menu,
  FolderKanban,
} from "lucide-react";

import API from "../api/api";

type DashboardLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

function DashboardLayout({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const { search, setSearch } = useSearch();

  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const loadHeaderData = async () => {
      try {
        const [userRes, notificationRes] = await Promise.all([
          API.get("/api/users/me"),
          API.get("/api/notifications"),
        ]);

        setUser({
          username: userRes.data.username || "",
          email: userRes.data.email || "",
        });

        setNotifications(
          Array.isArray(notificationRes.data)
            ? notificationRes.data
            : []
        );
      } catch (error) {
        console.error("Header Data Error:", error);
      }
    };

    loadHeaderData();
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Projects",
      icon: FolderKanban,
      path: "/projects",
    },
    {
      name: "Tasks",
      icon: ClipboardList,
      path: "/tasks",
    },
    {
      name: "Analytics",
      icon: BarChart3,
      path: "/analytics",
    },
    {
      name: "Team",
      icon: Users,
      path: "/team",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex">
      <aside
        className={`fixed lg:static z-40 w-72 min-h-screen bg-white border-r border-slate-200 p-6 transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <h1 className="text-3xl font-bold text-[#0b46bc] mb-10">
          TaskHub
        </h1>

        <nav className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold ${
                  active
                    ? "bg-blue-50 text-[#0b46bc]"
                    : "text-slate-600 hover:bg-blue-50 hover:text-[#0b46bc]"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}

          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
        />
      )}

      <main className="flex-1 p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden bg-white p-3 rounded-2xl shadow"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                {title}
              </h2>

              <p className="text-slate-500">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* SEARCH */}
            <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-sm">
              <Search className="w-5 h-5 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none text-sm"
                placeholder="Search"
              />
            </div>

            {/* NOTIFICATIONS */}
            <div
              className="relative"
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
              <button className="bg-white p-3 rounded-2xl shadow-sm relative">
                <Bell className="w-5 h-5 text-slate-600" />

                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
  <div
    className="
      fixed sm:absolute
      top-20 sm:top-auto
      left-1/2 sm:left-auto
      -translate-x-1/2 sm:translate-x-0
      right-auto sm:right-0
      w-[90vw] sm:w-80
      max-w-[280px]
      bg-white
      rounded-2xl
      shadow-xl
      z-50
      max-h-80
      overflow-auto
    "
  >
    <div className="p-3 font-bold">
      Notifications
    </div>

    {notifications.length === 0 ? (
      <p className="p-4 text-sm text-slate-500">
        No notifications
      </p>
    ) : (
      notifications.map((task) => (
        <div
          key={task._id}
          className="p-3 hover:bg-slate-50"
        >
          <p className="font-semibold">
            {task.name}
          </p>

          <p className="text-xs text-slate-500">
            Project: {task.project?.name || "No Project"}
          </p>

          <p className="text-xs text-red-500 font-semibold">
            Due:{" "}
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "No Due Date"}
          </p>
        </div>
      ))
    )}
  </div>
)}


                        
                
            </div>

            {/* USER */}
            <div className="hidden sm:block bg-blue-200 px-4 py-2 rounded-2xl shadow-sm">
              <p className="font-bold text-slate-900">
                {user.username}
              </p>

              <p className="text-xs text-slate-600">
                {user.email}
              </p>
            </div>

          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;