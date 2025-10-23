import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

// Define types for task and team member
interface Task {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  assignee: string;
  dueDate?: Date;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

type AppContextType = {
  // User authentication
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (username: string, password: string) => void;
  logout: () => void;

  // Team information
  teamName: string;
  setTeamName: (name: string) => void;
  teamBio: string;
  setTeamBio: (bio: string) => void;
  teamMembers: TeamMember[];
  setTeamMembers: (members: TeamMember[]) => void;
  addTeamMember: (member: Omit<TeamMember, "id">) => void;

  // User information
  currentUser: TeamMember | null;
  setCurrentUser: (user: TeamMember | null) => void;

  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;

  // Project deadline
  deadline: Date | null;
  setDeadline: (date: Date | null) => void;
};

const defaultContextValue: AppContextType = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  login: () => {},
  logout: () => {},
  teamName: "My Team",
  setTeamName: () => {},
  teamBio: "Our team is participating in a hackathon!",
  setTeamBio: () => {},
  teamMembers: [],
  setTeamMembers: () => {},
  addTeamMember: () => {},
  currentUser: null,
  setCurrentUser: () => {},
  tasks: [],
  setTasks: () => {},
  addTask: () => {},
  updateTask: () => {},
  deadline: null,
  setDeadline: () => {},
};

export const AppContext = createContext<AppContextType>(defaultContextValue);

export const useAppContext = () => useContext(AppContext);

type AppProviderProps = {
  children: ReactNode;
};

// Force clear localStorage on initial load
if (typeof window !== "undefined") {
  localStorage.removeItem("isAuthenticated");
}

export const AppProvider = ({ children }: AppProviderProps) => {
  // Always start with not authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [teamName, setTeamName] = useState("My Team");
  const [teamBio, setTeamBio] = useState(
    "Our team is participating in a hackathon!"
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design user interface",
      description: "Create wireframes and design system",
      status: "To Do",
      assignee: "You",
    },
    {
      id: "2",
      title: "Set up database",
      description: "Configure MongoDB and create schemas",
      status: "To Do",
      assignee: "You",
    },
    {
      id: "3",
      title: "Implement authentication",
      description: "Add user login and registration",
      status: "To Do",
      assignee: "You",
    },
    {
      id: "4",
      title: "Create landing page",
      description: "Design and implement the landing page",
      status: "To Do",
      assignee: "You",
    },
  ]);
  const [deadline, setDeadline] = useState<Date | null>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  );

  // Initialize auth state from localStorage only on client-side
  useEffect(() => {
    // Force clear localStorage on component mount
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
    }

    // Always start as not authenticated
    setIsAuthenticated(false);
    setIsInitialized(true);
  }, []);

  // Update localStorage when authentication state changes
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      if (isAuthenticated) {
        localStorage.setItem("isAuthenticated", "true");
      } else {
        localStorage.removeItem("isAuthenticated");
      }
    }
  }, [isAuthenticated, isInitialized]);

  const login = (username: string, password: string) => {
    // In a real app, you would validate credentials against an API
    console.log(`Logging in with username: ${username}`);

    // Create a user based on the login info
    setCurrentUser({
      id: `user-${Date.now()}`,
      name: username,
      role: "Team Member",
      avatar: `https://placehold.co/200x200/1e293b/38bdf8?text=${username
        .charAt(0)
        .toUpperCase()}`,
    });

    setIsAuthenticated(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("isAuthenticated", "true");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
    }
  };

  const addTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const addTeamMember = (member: Omit<TeamMember, "id">) => {
    const newMember = {
      ...member,
      id: `member-${Date.now()}`,
    };
    setTeamMembers((prevMembers) => [...prevMembers, newMember]);
  };

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
    teamName,
    setTeamName,
    teamBio,
    setTeamBio,
    teamMembers,
    setTeamMembers,
    addTeamMember,
    currentUser,
    setCurrentUser,
    tasks,
    setTasks,
    addTask,
    updateTask,
    deadline,
    setDeadline,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
