import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAppContext } from "../context/AppContext";

export default function Auth() {
  const router = useRouter();
  const { isAuthenticated, login } = useAppContext();

  const [view, setView] = useState("initial");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ✅ Backend URL (from .env)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  console.log("✅ Current API_URL:", API_URL);


  // ✅ Delay auth check briefly to prevent flicker
  useEffect(() => {
    const timer = setTimeout(() => setIsCheckingAuth(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      const fromSignup = localStorage.getItem("fromSignup") === "true";
      if (fromSignup) {
        localStorage.removeItem("fromSignup");
        router.replace("/team-setup");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, router, isCheckingAuth]);

  // ✅ LOGIN HANDLER
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Login failed: ${text}`);
      }

      const data = await res.json();


      // Save token + auth state
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(data.user));

      login(data.user.name, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SIGNUP HANDLER
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Signup failed: ${text}`);
      }

      const data = await res.json();

      // Save token + auth state
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("fromSignup", "true");
      localStorage.setItem("user", JSON.stringify(data.user));

      login(username, password);
      router.push("/team-setup");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loader while checking
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen dark-theme-background flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (isAuthenticated) return null;

  // ✅ UI
  return (
    <div className="min-h-screen gradient-bg bg-pattern flex items-center justify-center p-4 relative overflow-hidden">
      <Head>
        <title>HackHub - Authentication</title>
      </Head>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="background-orb absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="background-orb absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="background-orb absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Auth Card */}
      <div className="auth-container w-full max-w-lg z-10">
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
          {/* Initial view */}
          {view === "initial" && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Get Started</h2>
              <p className="text-slate-300 mb-8">
                Choose how you'd like to join the hackathon
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => setView("login")}
                  className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold py-4 px-6 rounded-xl border border-slate-600/50 transition-all duration-300"
                >
                  Login to Existing Account
                </button>

                <button
                  onClick={() => setView("signup")}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Create New Team
                </button>

                <button
                  onClick={() => setView("join")}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Join Team with Code
                </button>
              </div>
            </div>
          )}

          {/* Login View */}
          {view === "login" && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
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
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
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
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
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
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-slate-100"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-slate-100"
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
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-slate-100"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? "Creating..." : "Sign Up & Create Team"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
