import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";

const AddTodo = () => {
  const navigate = useNavigate();
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Explicitly sync theme rendering
  const isDark = localStorage.getItem("theme") === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "/api/v4/todos/add",
        {
          headline,
          content,
          priority,
          category,
          dueDate: dueDate || undefined,
        },
        {
          withCredentials: true,
        },
      );
      toast.success("Task created!");
      navigate("/");
    } catch (error) {
      console.log("Error adding todo", error);
      toast.error("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  // Styling helpers
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
            Create Task
          </h2>
          <div className="w-9"></div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8 space-y-5 md:space-y-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="headline"
              className={`text-sm font-bold ${textMuted}`}
            >
              Title
            </label>
            <input
              type="text"
              id="headline"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-all ${inputBg}`}
              placeholder="What needs to be done?"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-2">
              <label className={`text-sm font-bold ${textMuted}`}>
                Priority
              </label>
              <select
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
              <label className={`text-sm font-bold ${textMuted}`}>
                Date (Optional)
              </label>
              <input
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
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-all ${inputBg}`}
              placeholder="Work, Personal, etc."
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="content"
              className={`text-sm font-bold ${textMuted}`}
            >
              Details
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all resize-none h-28 ${inputBg}`}
              placeholder="Add notes..."
            ></textarea>
          </div>

          <div className="pt-4 sm:pt-6">
            <button
              type="submit"
              disabled={loading || !headline}
              className={`w-full flex justify-center items-center gap-2 py-3 rounded-xl font-bold transition-all ${loading || !headline ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-[#222]" : `hover:scale-[1.02] shadow-sm ${buttonStyle}`}`}
            >
              <Check className="w-5 h-5" />{" "}
              {loading ? "Creating..." : "Save Task"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddTodo;
