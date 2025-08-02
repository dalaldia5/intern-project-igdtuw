import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAppContext } from "../context/AppContext";

export default function Auth() {
  const router = useRouter();
  const { isAuthenticated, login } = useAppContext();
  const [view, setView] = useState("initial");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication status after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      // Check if user came from signup (should go to team setup)
      const fromSignup = localStorage.getItem("fromSignup") === "true";
      if (fromSignup) {
        localStorage.removeItem("fromSignup");
        router.replace("/team-setup");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, router, isCheckingAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // For demo purposes, we'll just call login with any credentials
      login(username, password);

      // Manually set localStorage for immediate effect
      localStorage.setItem("isAuthenticated", "true");

      // Make sure we're not marked as coming from signup
      localStorage.removeItem("fromSignup");

      // Use router.push for navigation
      router.push("/dashboard");
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Set authenticated
      login(username, password);

      // Set localStorage flags
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("fromSignup", "true"); // Mark that we're coming from signup

      // Redirect to team setup
      router.push("/team-setup");
    } catch (error) {
      setError("Error creating account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  // Don't render anything if authenticated (during redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Head>
        <title>HackHub - Login</title>
      </Head>

      <div className="card w-full max-w-md">
        {/* Initial View */}
        {view === "initial" && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-2 text-slate-100">
              Welcome to HackHub
            </h2>
            <p className="text-center text-slate-400 mb-6">
              The ultimate platform for hackathon collaboration.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setView("login")}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setView("signup")}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Create a New Team (Sign Up)
              </button>
              <button
                onClick={() => setView("join")}
                className="w-full border border-sky-500 text-sky-400 hover:bg-sky-900 font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Join a Team with Code
              </button>
            </div>
          </div>
        )}

        {/* Login View */}
        {view === "login" && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-100">
              Login
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-slate-300">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1 text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="text-center text-sm text-slate-400 mt-6">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setView("initial");
                }}
                className="font-semibold text-sky-400 hover:underline"
              >
                ← Back
              </a>
            </p>
          </div>
        )}

        {/* Signup View */}
        {view === "signup" && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-100">
              Create Your Team
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSignup}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-slate-300">
                  Your Name (Leader)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1 text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {loading ? "Creating..." : "Sign Up & Create Team"}
              </button>
            </form>
            <p className="text-center text-sm text-slate-400 mt-6">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setView("initial");
                }}
                className="font-semibold text-sky-400 hover:underline"
              >
                ← Back
              </a>
            </p>
          </div>
        )}

        {/* Join View */}
        {view === "join" && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-100">
              Join Your Team
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-slate-300">
                  Team Invite Code
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100 font-mono"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-slate-300">
                  Your Name
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1 text-slate-300">
                  Set Your Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {loading ? "Joining..." : "Join Team"}
              </button>
            </form>
            <p className="text-center text-sm text-slate-400 mt-6">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setView("initial");
                }}
                className="font-semibold text-sky-400 hover:underline"
              >
                ← Back
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
