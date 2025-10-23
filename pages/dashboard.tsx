import { useState, useEffect, useRef, useMemo } from "react";
import Layout from "../components/Layout";
import Head from "next/head";
import Script from "next/script";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/router";

// Add Chart.js type to Window interface
declare global {
  interface Window {
    Chart: any;
  }
}

export default function Dashboard() {
  const router = useRouter();
  const {
    tasks,
    teamName,
    teamBio,
    teamMembers,
    currentUser,
    isAuthenticated,
    deadline,
  } = useAppContext();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);
  const [chartJsLoaded, setChartJsLoaded] = useState(false);

  // Calculate task statistics - memoized to prevent unnecessary recalculations
  const taskStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "Done").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "In Progress"
    ).length;
    const todoTasks = tasks.filter((t) => t.status === "To Do").length;
    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      completionPercentage,
      chartData: [completedTasks, inProgressTasks, todoTasks],
    };
  }, [tasks]);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
    // Short delay to ensure authentication state is loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Calculate time remaining until deadline
  useEffect(() => {
    if (!deadline) {
      setTimeRemaining("Deadline not set");
      return;
    }

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const distance = deadline.getTime() - now;

      if (distance < 0) {
        setTimeRemaining("Expired");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      return `${days} days, ${hours} hours, ${minutes} minutes remaining`;
    };

    setTimeRemaining(calculateTimeRemaining());

    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [deadline]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && typeof window !== "undefined") {
      console.log("Not authenticated, redirecting to auth page");
      router.replace("/auth");
    }
  }, [isAuthenticated, router, isLoading]);

  // Handle Chart.js script load
  const handleChartJsLoad = () => {
    console.log("Chart.js script loaded");
    setChartJsLoaded(true);
  };

  // Initialize and update chart
  useEffect(() => {
    if (!isClient || !chartRef.current || !chartJsLoaded || !window.Chart)
      return;

    // Clear any previous errors
    setChartError(null);

    try {
      // Get chart context
      const ctx = chartRef.current.getContext("2d");
      if (!ctx) {
        setChartError("Could not get canvas context");
        return;
      }

      // Check for existing chart instance and destroy it
      const existingChart = window.Chart.getChart(chartRef.current);
      if (existingChart) {
        existingChart.destroy();
      }

      // Create new chart
      new window.Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Done", "In Progress", "To Do"],
          datasets: [
            {
              data: taskStats.chartData,
              backgroundColor: [
                "#22c55e", // green-500
                "#f59e0b", // amber-500
                "#ef4444", // red-500
              ],
              borderColor: "#1e293b", // slate-800
              borderWidth: 4,
              hoverOffset: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          animation: {
            duration: 500, // Reduced animation time for faster rendering
          },
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#94a3b8", // slate-400
                font: { size: 14 },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || "";
                  if (label) label += ": ";
                  if (context.parsed !== null)
                    label += context.parsed + " tasks";
                  return label;
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error creating chart:", error);
      setChartError(
        `Error creating chart: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    // Cleanup function
    return () => {
      try {
        const existingChart = window.Chart?.getChart?.(chartRef.current);
        if (existingChart) {
          existingChart.destroy();
        }
      } catch (e) {
        console.error("Error cleaning up chart:", e);
      }
    };
  }, [isClient, taskStats, chartJsLoaded]);

  // Get the first letter of the team name for the avatar
  const teamInitial = teamName ? teamName.charAt(0) : "T";

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <Head>
        <title>HackHub - Dashboard</title>
      </Head>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"
        strategy="beforeInteractive"
        onLoad={handleChartJsLoad}
        onError={() => setChartError("Failed to load Chart.js")}
      />
      <h2 className="text-3xl font-bold mb-6">Team Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <div className="card lg:col-span-2">
          <h3 className="font-semibold mb-4 text-lg">Project Progress</h3>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-slate-400">
                This chart visualizes your team's task completion status.
              </p>
              {timeRemaining && (
                <p className="text-sm text-sky-400 mt-1 font-bold">
                  <span className="inline-block mr-2">⏱️</span>
                  {timeRemaining}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-sky-400">
                {taskStats.completionPercentage}%
              </p>
              <p className="text-xs text-slate-400">Tasks Completed</p>
            </div>
          </div>
          <div className="chart-container relative h-64">
            {chartError && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800 bg-opacity-75 rounded-lg">
                <p className="text-red-400 text-center p-4">{chartError}</p>
              </div>
            )}
            {!chartJsLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="loader"></div>
              </div>
            )}
            <canvas ref={chartRef} id="progressChart"></canvas>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-6">
            <div className="text-center p-2 bg-slate-800 rounded-lg">
              <p className="text-sm text-green-400 font-medium">Done</p>
              <p className="text-2xl font-bold">{taskStats.completedTasks}</p>
            </div>
            <div className="text-center p-2 bg-slate-800 rounded-lg">
              <p className="text-sm text-yellow-400 font-medium">In Progress</p>
              <p className="text-2xl font-bold">{taskStats.inProgressTasks}</p>
            </div>
            <div className="text-center p-2 bg-slate-800 rounded-lg">
              <p className="text-sm text-red-400 font-medium">To Do</p>
              <p className="text-2xl font-bold">{taskStats.todoTasks}</p>
            </div>
          </div>
        </div>

        {/* Team Intro */}
        <div className="card">
          <h3 className="font-semibold mb-4 text-lg">{teamName}</h3>
          <img
            src={`https://placehold.co/100x100/1e293b/38bdf8?text=${teamInitial}`}
            alt="Team Logo"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-slate-700"
          />
          <p className="text-slate-400 text-sm text-center">{teamBio}</p>
          <button
            onClick={() => router.push("/team-setup")}
            className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Edit Team Info
          </button>
        </div>
      </div>

      <div className="card mt-6">
        <h3 className="font-semibold mb-4 text-lg">Upcoming Tasks</h3>
        {tasks.filter((task) => task.status !== "Done").length > 0 ? (
          <div className="space-y-3">
            {tasks
              .filter((task) => task.status !== "Done")
              .map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-slate-800 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-slate-400">
                      Assigned to: {task.assignee}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      task.status === "In Progress"
                        ? "bg-yellow-900 text-yellow-300"
                        : "bg-red-900 text-red-300"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-4">
            All tasks completed! 🎉
          </p>
        )}
      </div>

      {/* Team Members Section */}
      <div className="card mt-6">
        <h3 className="font-semibold mb-4 text-lg">Team Members</h3>
        {teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center p-3 bg-slate-800 rounded-lg"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-slate-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-slate-400 mb-3">No team members yet</p>
            <button
              onClick={() => router.push("/team-setup")}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Add Team Members
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
