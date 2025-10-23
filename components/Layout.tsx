import React, { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAppContext } from "../context/AppContext";

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
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Tasks", href: "/tasks", icon: "✅" },
    { name: "Chat", href: "/chat", icon: "💬" },
    { name: "Files", href: "/files", icon: "📁" },
    { name: "Pitch", href: "/pitch", icon: "🚀" },
    { name: "Team", href: "/team", icon: "👥" },
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
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-sky-500">HackHub</h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg ${
                    router.pathname === item.href
                      ? "bg-sky-700 text-white"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center p-3 w-full text-left text-slate-300 hover:bg-slate-700 rounded-lg"
          >
            <span className="mr-3">👋</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
};

export default Layout;
