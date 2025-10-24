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

  const handleLogin = (e: React.FormEvent) => {
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
    <div className="min-h-screen gradient-bg bg-pattern flex items-center justify-center p-4 relative overflow-hidden">
      <Head>
        <title>HackHub - Authentication</title>
      </Head>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="background-orb absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="background-orb absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="background-orb absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="auth-container w-full max-w-lg">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="auth-logo w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="auth-title text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-2">
            HackHub
          </h1>
          <p className="text-slate-400">Where Innovation Meets Collaboration</p>
        </div>

        <div className="auth-card vibrant-card p-8">
          {/* Initial View */}
          {view === "initial" && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Get Started
              </h2>
              <p className="text-slate-300 mb-8">
                Choose how you'd like to join the hackathon
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => setView("login")}
                  className="w-full group relative overflow-hidden bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold py-4 px-6 rounded-xl border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center">
                    <span>Login to Existing Account</span>
                  </div>
                </button>

                <button
                  onClick={() => setView("signup")}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center justify-center">
                    <span>Create New Team</span>
                  </div>
                </button>

                <button
                  onClick={() => setView("join")}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center justify-center">
                    <span>Join Team with Code</span>
                  </div>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-600/50">
                <p className="text-sm text-slate-400">
                  New to hackathons?{" "}
                  <span className="text-purple-400 cursor-pointer hover:underline">
                    Learn more
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Login View */}
          {view === "login" && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-slate-300">Sign in to your account</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-center">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setView("initial")}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  ← Back to options
                </button>
              </div>
            </div>
          )}

          {/* Signup View */}
          {view === "signup" && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 text-slate-100">
                Create Your Team
              </h2>
              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}
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
                  className="w-full btn-primary"
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
              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}
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
                  className="w-full btn-primary"
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
    </div>
  );
}
