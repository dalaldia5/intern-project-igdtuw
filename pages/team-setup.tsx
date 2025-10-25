import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAppContext } from "../context/AppContext";

export default function TeamSetup() {
  const router = useRouter();
  const {
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
      <div className="min-h-screen dark-theme-background flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark-theme-background flex items-center justify-center p-4">
      <Head>
        <title>HackHub - Team Setup</title>
      </Head>

      <div className="max-w-2xl mx-auto w-full">
        {!success ? (
          <div className="card">
            <h2 className="text-display-md font-display text-gradient-primary mb-2 text-center text-glow">
              Setup Your Team
            </h2>
            <p className="text-body-sm font-body text-zinc-400 mb-6 text-center">
              As the team leader, please add your team members below.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="label-enhanced">Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g., The Code Crusaders"
                  className="input-enhanced w-full mt-1 placeholder-enhanced"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="label-enhanced">Team Bio</label>
                <textarea
                  value={teamBio}
                  onChange={(e) => setTeamBio(e.target.value)}
                  placeholder="Brief description of your team"
                  className="input-enhanced w-full mt-1 placeholder-enhanced"
                  rows={3}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="label-enhanced">Hackathon Deadline</label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="input-enhanced w-full mt-1"
                  min={new Date().toISOString().slice(0, 16)} // Prevent past dates
                  required
                />
                <p className="text-caption text-zinc-500 mt-1">
                  This will be your project deadline and hackathon countdown
                  timer
                </p>
              </div>

              <div className="space-y-3 mb-4">
                <label className="label-enhanced">Team Members</label>
                {members.map((member, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        updateMember(index, "name", e.target.value)
                      }
                      placeholder={`Member ${index + 1} Name`}
                      className="input-enhanced w-1/2 placeholder-enhanced"
                      required={index === 0}
                    />
                    <select
                      value={member.role}
                      onChange={(e) =>
                        updateMember(index, "role", e.target.value)
                      }
                      className="input-enhanced w-1/2"
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
                className="w-full mb-4 btn-secondary text-sm"
              >
                Add Another Member
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  loading
                    ? "btn-secondary opacity-50 cursor-not-allowed"
                    : "btn-primary"
                }`}
              >
                {loading ? "Creating Team..." : "Create Team & Generate Code"}
              </button>
            </form>
          </div>
        ) : (
          <div className="vibrant-card text-center">
            <h2 className="text-display-sm font-display text-gradient-accent mb-2">
              Team Created!
            </h2>
            <p className="text-body-sm font-body text-zinc-400 mb-4">
              Share this code with your team members to join.
            </p>
            <div className="glass border-2 border-dashed border-cyan-400 rounded-xl p-4 mb-6">
              <p className="text-display-sm font-mono tracking-widest text-gradient-primary">
                {inviteCode}
              </p>
            </div>
            <button onClick={enterDashboard} className="w-full btn-primary">
              Enter Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
