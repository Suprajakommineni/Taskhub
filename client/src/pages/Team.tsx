import { FolderKanban, Mail, Trash2 } from "lucide-react";
import DashboardLayout from "../Components/DashboardLayout";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import teamApi from "../api/teamapi";

function Team() {
  const [showModal, setShowModal] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Available");

  // FETCH MEMBERS
  const fetchMembers = async () => {
    try {
      const res = await teamApi.get("/");

      console.log("TEAM RESPONSE:", res.data);

      setMembers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setMembers([]);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // SAVE MEMBER
  const saveMember = async () => {
    try {
      await teamApi.post("/", {
        username,
        email,
        role,
        status,
      });

      fetchMembers();

      setUsername("");
      setEmail("");
      setRole("");
      setStatus("Available");
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE MEMBER (NEW)
  const deleteMember = async (id: string) => {
    try {
      await teamApi.delete(`/${id}`);
      fetchMembers();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <DashboardLayout
      title="Team"
      subtitle="Manage team members and project collaboration."
    >
      {/* ADD BUTTON */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0b46bc] text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      {/* MEMBERS GRID */}
      <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.isArray(members) &&
          members.map((member) => {
            const assignedProjects: string[] = [];

            return (
              <div
                key={member._id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition relative"
              >
                {/* DELETE BUTTON */}
                <button
                  onClick={() => deleteMember(member._id)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#0b46bc] flex items-center justify-center text-xl font-bold">
                    {member.username?.[0]}
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      {member.username}
                    </h2>
                    <p className="text-sm text-slate-500">{member.role}</p>
                  </div>
                </div>

                {/* STATUS */}
                <span
                  className={`inline-block text-xs px-3 py-1 rounded-full font-bold mb-5 ${
                    member.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : member.status === "Busy"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {member.status}
                </span>

                {/* EMAIL */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </div>

                  <div className="flex items-start gap-2 text-slate-600">
                    <FolderKanban className="w-4 h-4 mt-1" />
                    <div>
                      {assignedProjects.length === 0 && (
                        <p>No projects assigned</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Add Team Member
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border rounded-2xl"
              />

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-2xl"
              />

              <input
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border rounded-2xl"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border rounded-2xl"
              >
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Offline">Offline</option>
              </select>

              <button
                onClick={saveMember}
                className="w-full bg-[#0b46bc] text-white py-3 rounded-2xl font-bold"
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Team;