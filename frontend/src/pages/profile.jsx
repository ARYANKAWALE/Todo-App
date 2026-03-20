import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Calendar, LogOut } from "lucide-react";
import avatar from "../assets/images/image.png";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDark = localStorage.getItem("theme") === "dark";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/v4/users/current-user", {
          withCredentials: true,
        });
        setUser(response.data.data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching user", error);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post("/api/v4/users/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.log("Logout Failed", error);
      toast.error("Failed to logout");
    }
  };

  const bgMain = isDark ? "bg-[#050505]" : "bg-[#fafafa]";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-500";
  const cardBg = isDark
    ? "bg-[#111] shadow-none border border-transparent"
    : "bg-white shadow-xl border border-gray-100";
  const inputBg = isDark
    ? "bg-[#1a1a1a] border border-transparent"
    : "bg-gray-50 border border-gray-100";

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
      className={`min-h-screen ${bgMain} flex flex-col justify-center items-center p-4 transition-colors duration-300 font-sans`}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-sm rounded-3xl overflow-hidden relative transition-colors duration-300 ${cardBg}`}
      >
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => navigate("/")}
            className={`p-2 rounded-full transition-colors focus:outline-none ${isDark ? "text-white bg-black/50 hover:bg-black/70" : "text-black bg-white/50 hover:bg-white/80"}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`h-24 sm:h-32 w-full transition-colors duration-300 ${isDark ? "bg-[#1a1a1a]" : "bg-gray-100"}`}
        ></div>

        <div className="flex justify-center -mt-12 sm:-mt-16 relative">
          <img
            src={avatar}
            alt="Profile avatar"
            className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 object-cover transition-colors duration-300 ${isDark ? "border-[#111] bg-[#111]" : "border-white bg-gray-50"}`}
          />
        </div>

        <div className="p-6 sm:p-8 pt-4 sm:pt-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2
              className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${textMain}`}
            >
              {user?.fullname}
            </h2>
            <p
              className={`text-sm font-bold mt-1 transition-colors duration-300 ${textMuted}`}
            >
              @{user?.username}
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <div
              className={`flex items-center gap-4 p-3 sm:p-4 rounded-xl transition-colors duration-300 ${inputBg}`}
            >
              <Mail
                className={`w-5 h-5 shrink-0 transition-colors duration-300 ${textMuted}`}
              />
              <div className="overflow-hidden">
                <p
                  className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${textMuted}`}
                >
                  Email Address
                </p>
                <p
                  className={`text-sm font-bold truncate transition-colors duration-300 ${textMain}`}
                >
                  {user?.email}
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-4 p-3 sm:p-4 rounded-xl transition-colors duration-300 ${inputBg}`}
            >
              <Calendar
                className={`w-5 h-5 shrink-0 transition-colors duration-300 ${textMuted}`}
              />
              <div>
                <p
                  className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${textMuted}`}
                >
                  Member Since
                </p>
                <p
                  className={`text-sm font-bold transition-colors duration-300 ${textMain}`}
                >
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className={`w-full py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${isDark ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
