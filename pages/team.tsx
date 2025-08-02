import { useState } from "react";
import Layout from "../components/Layout";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

export default function Team() {
  const [teamName, setTeamName] = useState("Team Synapse");
  const [teamBio, setTeamBio] = useState(
    "Building the future, one line of code at a time. We're a passionate team of developers and designers focused on creating impactful AI-driven solutions."
  );
  const [inviteCode, setInviteCode] = useState("HACK-25-XYZ");
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: "Dia",
      role: "Leader",
      avatar: "https://placehold.co/40x40/38bdf8/ffffff?text=D",
    },
    {
      id: 2,
      name: "Aastha",
      role: "Backend",
      avatar: "https://placehold.co/40x40/ca8a04/ffffff?text=A",
    },
    {
      id: 3,
      name: "Aarti",
      role: "Frontend",
      avatar: "https://placehold.co/40x40/be185d/ffffff?text=A",
    },
    {
      id: 4,
      name: "Anshu",
      role: "AI/ML",
      avatar: "https://placehold.co/40x40/4f46e5/ffffff?text=A",
    },
  ]);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [editMemberName, setEditMemberName] = useState("");
  const [editMemberRole, setEditMemberRole] = useState("");

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    alert("Invite code copied to clipboard!");
  };

  const saveTeamProfile = () => {
    // In a real app, this would save to a backend
    alert("Team profile updated!");
  };

  const openEditMemberModal = (member: TeamMember) => {
    setCurrentMemberId(member.id);
    setEditMemberName(member.name);
    setEditMemberRole(member.role);
    setShowEditMemberModal(true);
  };

  const closeEditMemberModal = () => {
    setShowEditMemberModal(false);
    setCurrentMemberId(null);
  };

  const updateMember = () => {
    if (currentMemberId === null) return;

    setMembers(
      members.map((member) =>
        member.id === currentMemberId
          ? { ...member, name: editMemberName, role: editMemberRole }
          : member
      )
    );

    closeEditMemberModal();
  };

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-6">Team Settings</h2>
      <p className="text-slate-400 mb-6 max-w-3xl">
        Manage your team's identity and member roles here. You can update the
        team bio that appears on the dashboard and assign specific roles to each
        member to clarify responsibilities. Your unique invite code is also
        available here to share with new members.
      </p>
      <div className="card mb-6">
        <h3 className="font-semibold text-lg mb-4">Team Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-400">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-400">
              Team Bio
            </label>
            <textarea
              value={teamBio}
              onChange={(e) => setTeamBio(e.target.value)}
              className="w-full mt-1 h-24 bg-slate-700 border border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-400">
              Team Invite Code
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                readOnly
                value={inviteCode}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 font-mono"
              />
              <button
                onClick={copyInviteCode}
                className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="pt-4">
            <button
              onClick={saveTeamProfile}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Manage Members</h3>
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex justify-between items-center p-3 bg-slate-900 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  className="w-10 h-10 rounded-full"
                  alt={member.name}
                />
                <p className="font-semibold">{member.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">{member.role}</span>
                <button
                  onClick={() => openEditMemberModal(member)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-white py-1 px-2 rounded-md"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Member Modal */}
      {showEditMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="card w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Edit Team Member</h2>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-slate-400">
                  Name
                </label>
                <input
                  type="text"
                  value={editMemberName}
                  onChange={(e) => setEditMemberName(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1 text-slate-400">
                  Role
                </label>
                <select
                  value={editMemberRole}
                  onChange={(e) => setEditMemberRole(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                >
                  <option value="Leader">Leader</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Designer">Designer</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={closeEditMemberModal}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={updateMember}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
