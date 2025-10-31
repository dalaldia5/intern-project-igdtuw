import { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
    hackathonEndTime,
  } = useAppContext();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);
  const [chartJsLoaded, setChartJsLoaded] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [hackathonTimeRemaining, setHackathonTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

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

  // Simplified chart initialization function
  const initializeChart = useCallback(() => {
    console.log("🎯 Initializing chart", {
      hasChartRef: !!chartRef.current,
      hasChart: !!window.Chart,
      taskData: taskStats.chartData,
    });

    // Simple dependency check
    if (!chartRef.current || !window.Chart) {
      console.log("❌ Missing dependencies for chart");
      return;
    }

    try {
      setChartLoading(true);
      setChartError(null);

      // Get chart context with retry
      const ctx = chartRef.current.getContext("2d");
      if (!ctx) {
        console.error("Could not get canvas context");
        setChartError("Could not get canvas context");
        setChartLoading(false);
        return;
      }

      // Check for existing chart instance and destroy it
      const existingChart = window.Chart.getChart(chartRef.current);
      if (existingChart) {
        console.log("🗑️ Destroying existing chart");
        existingChart.destroy();
      }

      // Create new chart
      const chart = new window.Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Done", "In Progress", "To Do"],
          datasets: [
            {
              data: taskStats.chartData,
              backgroundColor: [
                "#10b981", // emerald-500
                "#f59e0b", // amber-500
                "#f43f5e", // rose-500
              ],
              borderColor: "#18181b", // zinc-900
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
                color: "#f8fafc", // slate-50 (much darker/more visible)
                font: { size: 14, weight: 600 },
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

      console.log("Chart created successfully");
      setChartError(null);
      setChartLoading(false);
    } catch (error) {
      console.error("Error creating chart:", error);
      setChartError(
        `Error creating chart: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setChartLoading(false);
    }
  }, [taskStats]);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
    // Check if Chart.js is already loaded (for navigation back scenarios)
    if (typeof window !== "undefined" && window.Chart) {
      setChartJsLoaded(true);
    }
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

  // Hackathon countdown timer using context
  useEffect(() => {
    if (!hackathonEndTime) return;

    const calculateHackathonTime = () => {
      const now = new Date().getTime();
      const distance = hackathonEndTime.getTime() - now;

      if (distance < 0) {
        setHackathonTimeRemaining(null);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setHackathonTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateHackathonTime();

    const timer = setInterval(calculateHackathonTime, 1000); // Update every second

    return () => clearInterval(timer);
  }, [hackathonEndTime]);

  // Calculate hackathon progress percentage
  const getHackathonProgress = () => {
    if (!hackathonEndTime || !hackathonTimeRemaining) return 0;

    // Calculate total hackathon duration (assuming it started when the end time was set)
    const totalDuration = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
    const remainingTime =
      hackathonTimeRemaining.days * 24 * 60 * 60 * 1000 +
      hackathonTimeRemaining.hours * 60 * 60 * 1000 +
      hackathonTimeRemaining.minutes * 60 * 1000 +
      hackathonTimeRemaining.seconds * 1000;

    const elapsed = totalDuration - remainingTime;
    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  };

  // Redirect to login if not authenticated
  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated && typeof window !== "undefined") {
  //     console.log("Not authenticated, redirecting to auth page");
  //     router.replace("/auth");
  //   }
  // }, [isAuthenticated, router, isLoading]);

  // Handle Chart.js script load
  const handleChartJsLoad = () => {
    console.log("Chart.js script loaded");
    setChartJsLoaded(true);
  };

  // Main chart initialization effect
  useEffect(() => {
    console.log("📊 Chart effect triggered", {
      isClient,
      chartJsLoaded,
      hasChart: !!window.Chart,
      hasRef: !!chartRef.current,
      pathname: router.pathname,
    });

    if (!isClient || !chartJsLoaded || !window.Chart || !chartRef.current) {
      console.log("⏳ Waiting for dependencies...");
      return;
    }

    // Initialize chart with a small delay
    const timer = setTimeout(() => {
      console.log("🚀 Triggering chart initialization");
      initializeChart();
    }, 200);

    return () => clearTimeout(timer);
  }, [isClient, chartJsLoaded, initializeChart, taskStats.totalTasks]);

  // Route change handler for dashboard with multiple attempts
  useEffect(() => {
    if (router.pathname === "/dashboard" && chartJsLoaded && window.Chart) {
      console.log(
        "📍 Dashboard route active, initializing chart with multiple attempts"
      );

      // Multiple initialization attempts to ensure chart loads
      const timers = [
        setTimeout(() => {
          console.log("🎯 Attempt 1: Chart initialization");
          initializeChart();
        }, 100),
        setTimeout(() => {
          console.log("🎯 Attempt 2: Chart initialization");
          if (chartRef.current && !window.Chart.getChart(chartRef.current)) {
            initializeChart();
          }
        }, 500),
        setTimeout(() => {
          console.log("🎯 Attempt 3: Chart initialization");
          if (chartRef.current && !window.Chart.getChart(chartRef.current)) {
            initializeChart();
          }
        }, 1000),
      ];

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
      };
    }
  }, [router.pathname, chartJsLoaded, initializeChart]);

  // Force chart refresh when window gains focus (page switching)
  useEffect(() => {
    const handleFocus = () => {
      if (router.pathname === "/dashboard" && chartJsLoaded && window.Chart) {
        console.log("🔄 Window focused, checking chart");
        setTimeout(() => {
          if (chartRef.current && !window.Chart.getChart(chartRef.current)) {
            console.log("🚀 Force initializing chart on focus");
            initializeChart();
          }
        }, 200);
      }
    };

    const handleVisibilityChange = () => {
      if (
        !document.hidden &&
        router.pathname === "/dashboard" &&
        chartJsLoaded &&
        window.Chart
      ) {
        console.log("👁️ Page visible, checking chart");
        setTimeout(() => {
          if (chartRef.current && !window.Chart.getChart(chartRef.current)) {
            console.log("🚀 Force initializing chart on visibility");
            initializeChart();
          }
        }, 300);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router.pathname, chartJsLoaded, initializeChart]);

  // Periodic chart health check - ensures chart stays loaded
  useEffect(() => {
    if (router.pathname === "/dashboard" && chartJsLoaded && window.Chart) {
      const healthCheck = setInterval(() => {
        if (chartRef.current && !window.Chart.getChart(chartRef.current)) {
          console.log("🏥 Health check: Chart missing, reinitializing");
          initializeChart();
        }
      }, 2000); // Check every 2 seconds

      return () => clearInterval(healthCheck);
    }
  }, [router.pathname, chartJsLoaded, initializeChart]);

  // Cleanup function on unmount
  useEffect(() => {
    return () => {
      try {
        if (chartRef.current && window.Chart) {
          const existingChart = window.Chart.getChart(chartRef.current);
          if (existingChart) {
            existingChart.destroy();
          }
        }
      } catch (e) {
        console.error("Error cleaning up chart:", e);
      }
    };
  }, []);

  // Get the first letter of the team name for the avatar
  const teamInitial = teamName ? teamName.charAt(0) : "T";

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen dark-theme-background flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <> 
      <Head>
        <title>HackHub - Dashboard</title>
      </Head>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Chart.js loaded successfully");
          setChartJsLoaded(true);
          // Force immediate initialization
          setTimeout(() => {
            if (chartRef.current && window.Chart) {
              initializeChart();
            }
          }, 100);
        }}
        onError={(e) => {
          console.error("Failed to load Chart.js", e);
          setChartError("Failed to load Chart.js");
        }}
      />
      <h2 className="text-display-md font-display text-gradient-primary mb-8 text-glow">
        Team Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Progress Chart */}
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-heading-lg font-heading">Project Progress</h3>
            <button
              onClick={() => {
                console.log("🔄 Manual chart refresh triggered");
                console.log("Chart.js available:", !!window.Chart);
                console.log("Canvas ref:", !!chartRef.current);
                setChartError(null);
                setChartLoading(true);
                // Force destroy any existing chart first
                if (chartRef.current && window.Chart) {
                  const existingChart = window.Chart.getChart(chartRef.current);
                  if (existingChart) {
                    existingChart.destroy();
                  }
                }
                setTimeout(initializeChart, 100);
              }}
              className="btn-primary text-xs px-4 py-2"
              title="Refresh Chart"
            >
              🔄 Refresh
            </button>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-body-sm font-body text-zinc-400">
                This chart visualizes your team's task completion status.
              </p>
            </div>
            <div className="text-right">
              <p className="text-display-sm font-display text-gradient-primary">
                {taskStats.completionPercentage}%
              </p>
              <p className="text-caption text-zinc-400">Tasks Completed</p>
            </div>
          </div>

          {/* --- ENHANCEMENT: Replaced flat border with the new glass container --- */}
          <div className="chart-enhanced relative h-64 p-4">
            {chartError && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 bg-opacity-90 rounded-lg">
                <div className="text-center p-4">
                  <p className="text-rose-400 mb-2">{chartError}</p>
                  <button
                    onClick={() => {
                      setChartError(null);
                      setChartLoading(true);
                      initializeChart();
                    }}
                    className="btn-primary text-xs px-3 py-1"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            {(!chartJsLoaded || chartLoading) && !chartError && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 bg-opacity-50 rounded-lg">
                <div className="text-center">
                  <div className="loader mb-2"></div>
                  <p className="text-zinc-400 text-sm">
                    {!chartJsLoaded
                      ? "Loading Chart.js..."
                      : "Initializing chart..."}
                  </p>
                </div>
              </div>
            )}

            <canvas
              ref={chartRef}
              id="progressChart"
              className="w-full h-full"
            ></canvas>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="text-center p-3 glass rounded-xl">
              <p className="text-sm text-emerald-400 font-semibold">Done</p>
              <p className="text-2xl font-bold text-emerald-300">
                {taskStats.completedTasks}
              </p>
            </div>
            <div className="text-center p-3 glass rounded-xl">
              <p className="text-sm text-amber-400 font-semibold">
                In Progress
              </p>
              <p className="text-2xl font-bold text-amber-300">
                {taskStats.inProgressTasks}
              </p>
            </div>
            <div className="text-center p-3 glass rounded-xl">
              <p className="text-sm text-rose-400 font-semibold">To Do</p>
              <p className="text-2xl font-bold text-rose-300">
                {taskStats.todoTasks}
              </p>
            </div>
          </div>
        </div>

        {/* Team Intro */}
        <div className="card">
          <h3 className="text-heading-lg font-heading mb-4">{teamName}</h3>

          {/* --- ENHANCEMENT: Replaced <img> with a custom gradient avatar --- */}
          <div
            className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-zinc-700
                       flex items-center justify-center 
                       bg-gradient-to-br from-zinc-800 to-zinc-900"
          >
            <span className="text-4xl font-display text-gradient-primary">
              {teamInitial}
            </span>
          </div>

          <p className="text-body-sm font-body text-zinc-400 text-center">
            {teamBio}
          </p>
          <button
            onClick={() => router.push("/team-setup")}
            className="w-full mt-4 btn-primary"
          >
            Edit Team Info
          </button>
        </div>

        {/* Hackathon Timer */}
        <div className="vibrant-card glow-purple">
          {/* This div is the container for all content, to sit above the ::before glow */}
          <div>
            <div className="text-center">
              <h3 className="text-heading-lg font-heading mb-2 text-white">
                Project Deadline
              </h3>
              <p className="text-caption text-gray-300 mb-4">
                Time remaining until your hackathon deadline
              </p>

              {hackathonTimeRemaining ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="timer-digit-enhanced glow-purple">
                      <div className="text-display-sm font-display text-white tabular-nums">
                        {hackathonTimeRemaining.days
                          .toString()
                          .padStart(2, "0")}
                      </div>
                      <div className="text-caption text-gray-200">DAYS</div>
                    </div>
                    <div className="timer-digit-enhanced glow-pink">
                      <div className="text-display-sm font-display text-white tabular-nums">
                        {hackathonTimeRemaining.hours
                          .toString()
                          .padStart(2, "0")}
                      </div>
                      <div className="text-caption text-gray-200">HOURS</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="timer-digit-enhanced glow-orange">
                      <div className="text-display-sm font-display text-white tabular-nums">
                        {hackathonTimeRemaining.minutes
                          .toString()
                          .padStart(2, "0")}
                      </div>
                      <div className="text-caption text-gray-200">MINS</div>
                    </div>
                    <div className="timer-digit-enhanced glow-purple">
                      <div className="text-display-sm font-display text-white tabular-nums">
                        {hackathonTimeRemaining.seconds
                          .toString()
                          .padStart(2, "0")}
                      </div>
                      <div className="text-caption text-gray-200">SECS</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-xs text-gray-200 mb-2">
                      <span>Start</span>
                      <span>Finish</span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-2">
                      <div
                        className="progress-enhanced h-3 rounded-full transition-all duration-1000"
                        style={{
                          width: `${getHackathonProgress()}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-xs text-gray-200">
                        {Math.round(getHackathonProgress())}% Complete
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 timer-complete">
                  <div className="text-display-md font-display text-gradient-accent mb-2">
                    🎉
                  </div>
                  <p className="text-heading-md font-heading text-white">
                    Deadline Reached!
                  </p>
                  <p className="text-body-sm text-gray-200 mt-2">
                    Time to submit your project
                  </p>
                  <div className="mt-4 space-y-2">
                    <button className="btn-primary w-full">
                      Submit Project 🚀
                    </button>
                    <button
                      onClick={() => router.push("/team-setup")}
                      className="btn-secondary w-full text-sm"
                    >
                      Extend Deadline
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
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
                  className="p-4 glass rounded-xl flex justify-between items-center transition-all duration-300"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-zinc-400">
                      Assigned to: {task.assignee}
                    </p>
                  </div>
                  <span
                    className={`status-badge ${
                      task.status === "In Progress"
                        ? "status-progress"
                        : "status-todo"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-zinc-400 text-center py-4">
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
              // --- ENHANCEMENT: Replaced .member-card with the .glass class for consistency ---
              <div
                key={member.id}
                className="glass rounded-xl flex items-center p-4"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-zinc-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-zinc-400 mb-3">No team members yet</p>
            <button
              onClick={() => router.push("/team-setup")}
              className="btn-primary"
            >
              Add Team Members
            </button>
          </div>
        )}
      </div>
      </>
  );
}
