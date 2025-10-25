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

  const { logout, currentUser } = useAppContext();
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
  const handleLogout = async () => {
    logout();
    localStorage.removeItem("isAuthenticated");
    router.push("/auth");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen dark-theme-background flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (during redirect)
  if (!isLocallyAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen dark-theme-background flex">
      {/* Sidebar */}
      <aside className="w-64 h-screen sidebar-enhanced text-white p-4 flex flex-col flex-shrink-0">
        <div className="mb-6 text-center logo-container">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-lg">
            <Rocket className="text-white w-5 h-5" />
          </div>
          <h1 className="text-display-sm font-display text-gradient-primary">
            HackHub
          </h1>

          <p className="text-caption text-zinc-300 mt-2 font-medium">
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
                    className={`nav-item-enhanced nav-item ${
                      isActive ? "active" : ""
                    }`}
                  >
                    <Icon
                      className={`nav-icon mr-3 w-5 h-5 ${
                        isActive ? "active" : ""
                      }`}
                    />

                    <span className="nav-text">{item.name}</span>
                    {router.pathname === item.href && (
                      <div className="ml-auto w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t border-zinc-600/50">
          <div className="user-profile-card mb-3 p-2 rounded-lg">
            <div className="flex items-center">
              <div className="user-avatar w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-sm">
                👤
              </div>
              <div className="ml-3">
                <p className="text-body-sm font-body text-white">
                  {currentUser?.name || "User"}
                </p>
                <p className="text-caption text-zinc-400">
                  {currentUser?.role || "Team Member"}
                </p>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn nav-item w-full">
            <LogOut className="logout-icon mr-3 w-5 h-5" />
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content area - directly adjacent to sidebar */}
      <main className="flex-1 min-h-screen overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
