import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAppContext } from "../context/AppContext";

export default function TeamSetup() {
  const router = useRouter();
  const {
    isAuthenticated,
    setTeamName: updateTeamName,
    setTeamBio: updateTeamBio,
    setDeadline: updateDeadline,
    addTeamMember,
  } = useAppContext();

  const [teamName, setTeamName] = useState("");
  const [teamBio, setTeamBio] = useState(
    "Our team is participating in a hackathon!"
  );
  const [deadline, setDeadline] = useState("");
  const [members, setMembers] = useState([{ name: "", role: "" }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is authenticated and coming from signup
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);

      // Check if authenticated
      const isAuth = localStorage.getItem("isAuthenticated") === "true";

      if (!isAuth) {
        router.replace("/auth");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  // Add a new member input field
  const addMemberInput = () => {
    setMembers([...members, { name: "", role: "" }]);
  };

  // Update member information
  const updateMember = (
    index: number,
    field: "name" | "role",
    value: string
  ) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update team name
      updateTeamName(teamName);

      // Update team bio
      updateTeamBio(teamBio);

      // Update deadline
      if (deadline) {
        updateDeadline(new Date(deadline));
      }

      // Add team members
      members.forEach((member) => {
        if (member.name && member.role) {
          // Create a simple avatar based on first letter of name
          const firstLetter = member.name.charAt(0).toUpperCase();
          const avatar = `https://placehold.co/40x40/38bdf8/ffffff?text=${firstLetter}`;

          addTeamMember({
            name: member.name,
            role: member.role,
            avatar,
          });
        }
      });

      // Generate a random invite code
      const generatedCode = `HACK-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;
      setInviteCode(generatedCode);

      setSuccess(true);
    } catch (error) {
      console.error("Error setting up team:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle entering dashboard
  const enterDashboard = () => {
    router.push("/dashboard");
  };

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Head>
        <title>HackHub - Team Setup</title>
      </Head>

      <div className="max-w-2xl mx-auto w-full">
        {!success ? (
          <div className="card">
            <h2 className="text-3xl font-bold mb-2 text-center text-slate-100">
              Setup Your Team
            </h2>
            <p className="text-slate-400 mb-6 text-center">
              As the team leader, please add your team members below.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-300">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g., The Code Crusaders"
                  className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-slate-300">
                  Team Bio
                </label>
                <textarea
                  value={teamBio}
                  onChange={(e) => setTeamBio(e.target.value)}
                  placeholder="Brief description of your team"
                  className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100"
                  rows={3}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-slate-300">
                  Hackathon Deadline
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100"
                  required
                />
              </div>

              <div className="space-y-3 mb-4">
                <label className="text-sm font-medium text-slate-300">
                  Team Members
                </label>
                {members.map((member, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        updateMember(index, "name", e.target.value)
                      }
                      placeholder={`Member ${index + 1} Name`}
                      className="w-1/2 bg-slate-900 border border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100"
                      required={index === 0}
                    />
                    <select
                      value={member.role}
                      onChange={(e) =>
                        updateMember(index, "role", e.target.value)
                      }
                      className="w-1/2 bg-slate-900 border border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100"
                      required={index === 0}
                    >
                      <option value="" disabled>
                        Select Role
                      </option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Designer">Designer</option>
                      <option value="Leader">Leader</option>
                    </select>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addMemberInput}
                className="w-full mb-4 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Add Another Member
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {loading ? "Creating Team..." : "Create Team & Generate Code"}
              </button>
            </form>
          </div>
        ) : (
          <div className="card text-center">
            <h2 className="text-3xl font-bold mb-2 text-green-400">
              Team Created!
            </h2>
            <p className="text-slate-400 mb-4">
              Share this code with your team members to join.
            </p>
            <div className="bg-slate-900 border-2 border-dashed border-sky-400 rounded-lg p-4 mb-6">
              <p className="text-4xl font-mono tracking-widest">{inviteCode}</p>
            </div>
            <button
              onClick={enterDashboard}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Enter Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
