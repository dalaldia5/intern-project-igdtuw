"use client";
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
  const [inviteCode] = useState("HACK-25-XYZ");

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
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      alert("✅ Invite code copied to clipboard!");
    } catch {
      alert("❌ Failed to copy invite code");
    }
  };

  const saveTeamProfile = () => {
    alert("✅ Team profile updated!");
  };

  const openEditMemberModal = (member: TeamMember) => {
    setCurrentMember(member);
    setShowEditMemberModal(true);
  };

  const closeEditMemberModal = () => {
    setShowEditMemberModal(false);
    setCurrentMember(null);
  };

  const updateMember = () => {
    if (!currentMember) return;
    setMembers((prev) =>
      prev.map((member) =>
        member.id === currentMember.id ? currentMember : member
      )
    );
    closeEditMemberModal();
  };

  return (
    <Layout>
    <div className="p-6">
      {/* Header */}
      <h2 className="text-display-md font-display text-gradient-primary mb-6 text-glow">
        Team Settings
      </h2>
      <p className="text-body-sm font-body text-zinc-400 mb-6 max-w-3xl">
        Manage your team's identity and member roles here. You can update the
        team bio and assign roles to clarify responsibilities. Your unique
        invite code is also available here to share with new members.
      </p>

      {/* Team Profile Card */}
      <div className="card mb-6">
        <h3 className="text-heading-lg font-heading mb-4">Team Profile</h3>

        <div className="space-y-4">
          <div>
            <label className="label-enhanced">Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="input-enhanced w-full mt-1"
            />
          </div>

          <div>
            <label className="label-enhanced">Team Bio</label>
            <textarea
              value={teamBio}
              onChange={(e) => setTeamBio(e.target.value)}
              className="input-enhanced w-full mt-1 h-24"
            />
          </div>

          <div>
            <label className="label-enhanced">Team Invite Code</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                readOnly
                value={inviteCode}
                className="input-enhanced w-full font-mono"
              />
              <button
                onClick={copyInviteCode}
                className="btn-secondary text-sm px-4 py-2"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button onClick={saveTeamProfile} className="btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Members Card */}
      <div className="card">
        <h3 className="text-heading-lg font-heading mb-4">Manage Members</h3>
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="glass rounded-xl flex justify-between items-center p-3 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  className="w-10 h-10 rounded-full"
                  alt={member.name}
                />
                <p className="text-heading-sm font-heading">{member.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-body-sm font-body text-zinc-400">
                  {member.role}
                </span>
                <button
                  onClick={() => openEditMemberModal(member)}
                  className="text-xs btn-secondary py-1 px-2"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Member Modal */}
      {showEditMemberModal && currentMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-md">
            <h2 className="text-heading-xl font-heading mb-6">
              Edit Team Member
            </h2>

            <div className="space-y-4">
              <div>
                <label className="label-enhanced">Name</label>
                <input
                  type="text"
                  value={currentMember.name}
                  onChange={(e) =>
                    setCurrentMember({
                      ...currentMember,
                      name: e.target.value,
                    })
                  }
                  className="input-enhanced w-full"
                />
              </div>

              <div>
                <label className="label-enhanced">Role</label>
                <select
                  value={currentMember.role}
                  onChange={(e) =>
                    setCurrentMember({
                      ...currentMember,
                      role: e.target.value,
                    })
                  }
                  className="input-enhanced w-full"
                >
                  <option value="Leader">Leader</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Designer">Designer</option>
                </select>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={closeEditMemberModal}
                  className="w-full btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={updateMember}
                  className="w-full btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
}
