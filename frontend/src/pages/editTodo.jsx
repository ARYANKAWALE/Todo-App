import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, ArrowLeft, Check } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const EditTodo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);

  const [initialState, setInitialState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Apply exact explicit theme control
  const isDark = localStorage.getItem("theme") === "dark";

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await axios.get(`/api/v4/todos/${id}`, {
          withCredentials: true,
        });
        const todo = response.data.data;
        setHeadline(todo.headline);
        setContent(todo.content || "");
        setPriority(todo.priority || "Medium");
        setCategory(todo.category || "General");
        setDueDate(
          todo.dueDate
            ? new Date(todo.dueDate).toISOString().split("T")[0]
            : "",
        );
        setCompleted(todo.completed || false);

        setInitialState({
          headline: todo.headline,
          content: todo.content,
          priority: todo.priority || "Medium",
          category: todo.category || "General",
          dueDate: todo.dueDate
            ? new Date(todo.dueDate).toISOString().split("T")[0]
            : "",
          completed: todo.completed || false,
        });
        setLoading(false);
      } catch (error) {
        console.log("Error fetching todo", error);
        toast.error("Failed to load task");
        navigate("/");
      }
    };
    fetchTodo();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const updateData = { headline, content, priority, category, completed };
    if (dueDate) updateData.dueDate = dueDate;

    const updatePromise = axios.patch(
      `/api/v4/todos/modify/${id}`,
      updateData,
      { withCredentials: true },
    );

    toast.promise(updatePromise, {
      loading: "Saving...",
      success: "Task updated!",
      error: "Failed to update",
    });

    try {
      await updatePromise;
      setTimeout(() => navigate("/"), 800);
    } catch (error) {
      console.log("Error updating todo", error);
      setUpdating(false);
    }
  };

  const handleDeleteTodo = async () => {
    const confirmDelete = window.confirm("Delete this task permanently?");
    if (!confirmDelete) return;

    setDeleting(true);
    const deletePromise = axios.delete(`/api/v4/todos/modify/${id}`, {
      withCredentials: true,
    });

    toast.promise(deletePromise, {
      loading: "Deleting...",
      success: "Deleted.",
      error: "Failed to delete",
    });

    try {
      await deletePromise;
      setTimeout(() => navigate("/"), 800);
    } catch (error) {
      console.error("Error deleting:", error);
      setDeleting(false);
    }
  };

  const isChanged =
    initialState &&
    (headline !== initialState.headline ||
      content !== initialState.content ||
      priority !== initialState.priority ||
      category !== initialState.category ||
      dueDate !== initialState.dueDate ||
      completed !== initialState.completed);

  const bgMain = isDark ? "bg-[#050505]" : "bg-[#fafafa]";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-500";
  const cardBg = isDark
    ? "bg-[#111] shadow-none"
    : "bg-white shadow-xl border border-gray-100";
  const borderSubtle = isDark ? "border-white/5" : "border-gray-100";
  const inputBg = isDark
    ? "bg-[#1a1a1a] border-white/5 text-white focus:border-white/20"
    : "bg-gray-50 border-gray-200 text-black focus:border-gray-300";
  const buttonStyle = isDark
    ? "bg-white text-black hover:bg-gray-200"
    : "bg-black text-white hover:bg-gray-800";

  if (loading) {
    return (
      <div
        className={`min-h-screen ${bgMain} flex justify-center items-center`}
      >
        <div
          className={`animate-spin rounded-full h-8 w-8 border-b-2 ${textMain}`}
        ></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 ${bgMain} font-sans`}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-2xl rounded-3xl overflow-hidden ${cardBg}`}
      >
        <div
          className={`px-6 py-5 md:px-8 border-b flex items-center justify-between ${borderSubtle}`}
        >
          <button
            onClick={() => navigate("/")}
            className={`p-2 -ml-2 transition-colors focus:outline-none ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className={`text-lg md:text-xl font-bold ${textMain}`}>
            Edit Task
          </h2>
          <button
            onClick={() => !deleting && handleDeleteTodo()}
            className={`p-2 -mr-2 transition-colors hover:text-red-500 ${isDark ? "text-gray-400" : "text-gray-500"} ${deleting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleUpdate}
          className="p-6 md:p-8 space-y-5 md:space-y-6"
        >
          <label
            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${inputBg}`}
          >
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className={`w-5 h-5 rounded border focus:ring-1 focus:ring-offset-1 ${isDark ? "border-white/20 bg-[#222] text-white focus:ring-white focus:ring-offset-[#111]" : "border-gray-300 text-black focus:ring-black focus:ring-offset-white"}`}
            />
            <div>
              <p className={`font-bold text-sm ${textMain}`}>
                {completed ? "Task Completed" : "Mark Complete"}
              </p>
            </div>
          </label>

          <div className="space-y-2">
            <label className={`text-sm font-bold ${textMuted}`}>Title</label>
            <input
              type="text"
              required
              disabled={deleting}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-all ${inputBg}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-2">
              <label className={`text-sm font-bold ${textMuted}`}>
                Priority
              </label>
              <select
                disabled={deleting}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-all appearance-none ${inputBg}`}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-bold ${textMuted}`}>Date</label>
              <input
                disabled={deleting}
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-all ${inputBg}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-bold ${textMuted}`}>Category</label>
            <input
              disabled={deleting}
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-all ${inputBg}`}
            />
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-bold ${textMuted}`}>Details</label>
            <textarea
              disabled={deleting}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all resize-none h-28 ${inputBg}`}
            ></textarea>
          </div>

          <div className="pt-4 sm:pt-6">
            <button
              type="submit"
              disabled={!isChanged || updating || deleting}
              className={`w-full flex justify-center items-center gap-2 py-3 rounded-xl font-bold transition-all ${!isChanged || updating || deleting ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-[#222]" : `hover:scale-[1.02] shadow-sm ${buttonStyle}`}`}
            >
              <Check className="w-5 h-5" />{" "}
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditTodo;
