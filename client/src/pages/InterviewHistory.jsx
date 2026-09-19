import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import { FaArrowLeft, FaTrashAlt, FaSearch } from "react-icons/fa";
import { BsCheckCircleFill, BsClock, BsMic } from "react-icons/bs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modeFilter, setModeFilter] = useState("All");
  const navigate = useNavigate();

  const getMyInterviews = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${ServerUrl}/api/interview/get-interviews`,
        { withCredentials: true }
      );
      setInterviews(result.data || []);
    } catch (error) {
      console.error("Failed to load interview history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyInterviews();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this interview record?")) {
      return;
    }

    try {
      await axios.delete(`${ServerUrl}/api/interview/${id}`, {
        withCredentials: true,
      });
      setInterviews((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to delete interview:", error);
      alert("Failed to delete record. Please try again.");
    }
  };

  const filteredInterviews = interviews.filter((item) => {
    const matchesSearch =
      item.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.experience?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode =
      modeFilter === "All" ? true : item.mode === modeFilter;
    return matchesSearch && matchesMode;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 rounded-full bg-white shadow-xs hover:shadow-md border border-gray-200 transition cursor-pointer"
              title="Go Back"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Interview History
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                Review completed rounds, evaluation scores, and feedback
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/interview")}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition shadow-sm cursor-pointer"
          >
            <BsMic /> New Interview
          </button>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search by role or experience..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {["All", "Technical", "HR"].map((mode) => (
              <button
                key={mode}
                onClick={() => setModeFilter(mode)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  modeFilter === mode
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
            <p className="text-gray-400 text-sm">Loading your interview sessions...</p>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
            <p className="text-gray-600 font-semibold mb-2">No interviews found</p>
            <p className="text-gray-400 text-xs max-w-sm mx-auto mb-6">
              {searchTerm || modeFilter !== "All"
                ? "Try adjusting your search query or mode filters."
                : "You haven't completed any AI mock interviews yet."}
            </p>
            <button
              onClick={() => navigate("/interview")}
              className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-full hover:bg-emerald-700 transition cursor-pointer"
            >
              Start Your First Interview
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredInterviews.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/report/${item._id}`)}
                className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs hover:shadow-md transition-all border border-gray-200/80 cursor-pointer flex items-center justify-between flex-wrap gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs ${
                      item.mode === "HR"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {item.mode === "HR" ? "HR" : "TECH"}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-600 transition">
                      {item.role}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.mode} Round • {item.experience} •{" "}
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 ml-auto">
                  {/* SCORE */}
                  <div className="text-right">
                    <p className="text-xl font-black text-emerald-600">
                      {item.finalScore != null ? `${item.finalScore}/100` : "--"}
                    </p>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      Overall Score
                    </p>
                  </div>

                  {/* STATUS BADGE */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === "Completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={(e) => handleDelete(e, item._id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete interview session"
                  >
                    <FaTrashAlt size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default InterviewHistory;
