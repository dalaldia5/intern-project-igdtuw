import React, { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAppContext } from "../context/AppContext";
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  FileText,
  Mic,
  Users,
  LogOut,
  Rocket,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isLocallyAuthenticated, setIsLocallyAuthenticated] = useState(false);

  // Check localStorage directly for authentication status
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated") === "true";
      setIsLocallyAuthenticated(authStatus);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for storage events (in case another tab changes auth)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isLocallyAuthenticated) {
      router.push("/auth");
    }
  }, [isLocallyAuthenticated, router, isLoading]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Files", href: "/files", icon: FileText },
    { name: "Pitch", href: "/pitch", icon: Mic },
    { name: "Team", href: "/team", icon: Users },
  ];
  const handleLogout = () => {
    logout();
    localStorage.removeItem("isAuthenticated");
    router.push("/auth");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (during redirect)
  if (!isLocallyAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg bg-pattern flex">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-slate-900/95 via-slate-800/90 to-slate-900/95 text-white p-6 flex flex-col border-r border-slate-600/50 backdrop-blur-xl shadow-2xl">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-900 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
            <Rocket className="text-white w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-b from-purple-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            HackHub
          </h1>

          <p className="text-caption text-slate-300 mt-2 font-medium">
            Innovate. Collaborate. Launch
          </p>
        </div>
        <nav className="flex-1">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${router.pathname === item.href
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 shadow-lg"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                      }`}
                  >
                    <Icon className={`mr-3 w-5 h-5 ${isActive ? "text-purple-400" : "text-slate-400"}`} />

                    <span className="font-medium">{item.name}</span>
                    {router.pathname === item.href && (
                      <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-600/50">
          <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600/30">
            <div className="flex items-center">
              <div className="user-avatar w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm">
                👤
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">User</p>
                <p className="text-xs text-slate-400">Team Member</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="group flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/30"
          >
            <LogOut className="mr-3 w-5 h-5 text-slate-400 group-hover:text-red-400 transition" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto backdrop-blur-sm bg-pattern ml-64">
        {children}
      </div>
    </div>
  );
};

export default Layout;
