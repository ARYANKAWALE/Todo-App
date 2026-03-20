import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import avatar from "../assets/images/image.png";
import {
  Search,
  Plus,
  Calendar,
  Tag,
  Sun,
  Moon,
  LogOut,
  User,
  AlertCircle,
  CheckCircle2,
  Circle,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { format, isPast, isToday } from "date-fns";

const Home = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [query, setQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/v4/todos/", {
        withCredentials: true,
      });
      setTodos(response.data.data);
    } catch (error) {
      console.log("Error fetching todos", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      } else {
        toast.error("Failed to load todos");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/v4/users/current-user", {
        withCredentials: true,
      });
      setUser(response.data.data);
    } catch (error) {
      console.log("Error fetching user", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post("/api/v4/users/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.log("Logout Failed", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const toggleComplete = async (e, todo) => {
    e.stopPropagation();
    const previousTodos = [...todos];
    const updatedTodos = todos.map((t) =>
      t._id === todo._id ? { ...t, completed: !t.completed } : t,
    );
    setTodos(updatedTodos);

    try {
      await axios.patch(
        `/api/v4/todos/modify/${todo._id}`,
        {
          completed: !todo.completed,
        },
        { withCredentials: true },
      );
      if (!todo.completed) {
        toast.success("Task completed!");
      }
    } catch (error) {
      console.log("Error toggling todo", error);
      toast.error("Failed to update task status");
      setTodos(previousTodos);
    }
  };

  useEffect(() => {
    const searchTodos = async () => {
      if (query.length > 0) {
        try {
          const res = await axios.get(`/api/v4/todos/search?search=${query}`, {
            withCredentials: true,
          });
          setTodos(res.data.data);
        } catch (error) {
          console.log("Error:", error);
        }
      } else {
        fetchTodos();
      }
    };
    const timer = setTimeout(() => {
      searchTodos();
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Simplistic modern priority badge colors based strictly on explicit theme mapping
  const getBadgeStyle = (priority) => {
    const p = priority?.toLowerCase();
    if (p === "high")
      return isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600";
    if (p === "medium")
      return isDark
        ? "bg-yellow-500/20 text-yellow-400"
        : "bg-yellow-100 text-yellow-600";
    if (p === "low")
      return isDark
        ? "bg-green-500/20 text-green-400"
        : "bg-green-100 text-green-600";
    return isDark
      ? "bg-gray-500/20 text-gray-400"
      : "bg-gray-100 text-gray-600";
  };

  const filteredTodos = todos.filter(
    (t) => filterPriority === "All" || t.priority === filterPriority,
  );

  const mainBg = isDark ? "bg-[#050505]" : "bg-[#fafafa]";
  const navBg = isDark
    ? "bg-[#050505]/90 border-white/5"
    : "bg-white/90 border-gray-200";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-500";

  return (
    <div
      className={`min-h-screen ${mainBg} transition-colors duration-300 font-sans`}
    >
      {/* Minimal Top Navigation */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur-md border-b ${navBg} px-4 py-3 md:px-8 md:py-4`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <h1
              className={`text-xl md:text-2xl font-bold tracking-tight ${textMain}`}
            >
              TaskMaster
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <div className="relative group hidden sm:block">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`}
              />
              <input
                type="search"
                placeholder="Search tasks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`pl-9 pr-4 py-1.5 md:py-2 text-sm w-48 md:w-64 rounded-full border focus:outline-none focus:ring-1 transition-all focus:w-56 md:focus:w-72 ${isDark ? "bg-[#111] border-white/10 text-white focus:ring-white placeholder-gray-500" : "bg-white border-gray-200 text-black focus:ring-black placeholder-gray-400"}`}
              />
            </div>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-black"}`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <div className="relative">
              <button
                className="flex items-center hover:opacity-80 transition-opacity focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                <img
                  className={`w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border ${isDark ? "border-white/10" : "border-gray-200"}`}
                  src={avatar}
                  alt="User Avatar"
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 mt-3 w-48 border rounded-xl shadow-xl z-50 overflow-hidden ${isDark ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-100"}`}
                  >
                    <div
                      className={`px-4 py-3 border-b ${isDark ? "border-white/10" : "border-gray-100"}`}
                    >
                      <p className={`text-sm font-medium truncate ${textMain}`}>
                        {user?.fullname}
                      </p>
                      <p className={`text-xs truncate ${textMuted}`}>
                        @{user?.username}
                      </p>
                    </div>
                    <div className="p-1">
                      <Link
                        to="/profile"
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${isDark ? "text-white hover:bg-white/10" : "text-black hover:bg-gray-100"}`}
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <button
                        onClick={logout}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left mt-1 ${isDark ? "text-red-400 hover:bg-red-500/20" : "text-red-600 hover:bg-red-50"}`}
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div
            className={`flex flex-wrap gap-2 md:gap-3 p-1.5 rounded-xl border ${isDark ? "bg-[#111] border-white/5" : "bg-white border-gray-200"}`}
          >
            {["All", "High", "Medium", "Low"].map((prio) => {
              const isActive = filterPriority === prio;
              let btnClass = isActive
                ? isDark
                  ? "bg-white text-black shadow-sm"
                  : "bg-black text-white shadow-sm"
                : isDark
                  ? "text-gray-400 hover:bg-white/10"
                  : "text-gray-600 hover:bg-gray-100";

              return (
                <button
                  key={prio}
                  onClick={() => setFilterPriority(prio)}
                  className={`px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors ${btnClass}`}
                >
                  {prio}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => navigate("/add")}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-transform hover:scale-105 shadow-sm ${isDark ? "bg-white text-black" : "bg-black text-white"}`}
          >
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div
              className={`animate-spin rounded-full h-8 w-8 border-b-2 ${textMain}`}
            ></div>
          </div>
        ) : filteredTodos.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            {filteredTodos.map((todo) => {
              // Dark mode: No borders! Subtle dark bg.
              // Light mode: Clean white with delicate border.
              const cardBg = isDark
                ? todo.completed
                  ? "bg-[#111] opacity-50"
                  : "bg-[#151515] shadow-lg"
                : todo.completed
                  ? "bg-gray-50 opacity-60 border-gray-200"
                  : "bg-white border-gray-100 hover:shadow-xl border";

              return (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  key={todo._id}
                  onClick={() => navigate(`/todo/${todo._id}`)}
                  className={`group rounded-3xl cursor-pointer hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[240px] p-6 md:p-8 ${cardBg}`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`px-3 py-1.5 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-widest ${getBadgeStyle(todo.priority)}`}
                      >
                        {todo.priority || "Medium"}
                      </span>
                      <button
                        onClick={(e) => toggleComplete(e, todo)}
                        className="hover:scale-110 transition-transform focus:outline-none"
                      >
                        {todo.completed ? (
                          <CheckCircle2
                            className={`w-6 h-6 ${isDark ? "text-green-400" : "text-green-600"}`}
                          />
                        ) : (
                          <Circle
                            className={`w-6 h-6 ${isDark ? "text-gray-500" : "text-gray-300"}`}
                          />
                        )}
                      </button>
                    </div>
                    <h3
                      className={`text-lg md:text-xl font-bold mb-2 line-clamp-2 leading-snug ${textMain} ${todo.completed ? "line-through" : ""}`}
                    >
                      {todo.headline}
                    </h3>
                    {!todo.completed && (
                      <p
                        className={`text-sm font-medium line-clamp-3 leading-relaxed ${textMuted}`}
                      >
                        {todo.content}
                      </p>
                    )}
                  </div>

                  <div
                    className={`mt-5 pt-5 border-t flex flex-wrap items-center gap-3 ${isDark ? "border-white/5" : "border-gray-100"}`}
                  >
                    <div
                      className={`flex items-center gap-1.5 text-xs font-bold ${textMuted}`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      {todo.category || "General"}
                    </div>
                    {todo.dueDate && (
                      <div
                        className={`flex items-center gap-1.5 text-xs font-bold ${textMuted}`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(todo.dueDate), "MMM d, yyyy")}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex flex-col items-center justify-center py-24 rounded-3xl mt-4 max-w-xl mx-auto text-center border ${isDark ? "bg-[#111] border-white/5" : "bg-white border-gray-100"}`}
          >
            <div
              className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${isDark ? "bg-white/5" : "bg-gray-50"}`}
            >
              <AlertCircle className={`w-8 h-8 ${textMain}`} />
            </div>
            <h2 className={`text-lg md:text-xl font-bold mb-2 ${textMain}`}>
              No tasks found
            </h2>
            <p className={`mb-6 text-sm px-4 ${textMuted}`}>
              Your workspace is clear. Create a new task to get started.
            </p>
            <button
              onClick={() => navigate("/add")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${isDark ? "bg-white text-black" : "bg-black text-white"}`}
            >
              Create Task
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Home;
