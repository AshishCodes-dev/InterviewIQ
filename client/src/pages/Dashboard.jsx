import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  BsTrophy,
  BsLightningCharge,
  BsClockHistory,
  BsCoin,
  BsArrowRight,
  BsShieldCheck,
  BsCheckCircleFill,
} from "react-icons/bs";
import { FaUserTie, FaMicrophoneAlt, FaChartLine } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ServerUrl } from "../App";
import AuthModel from "../components/AuthModel";

const Dashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!userData) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/interview/analytics`, {
          withCredentials: true,
        });
        setAnalytics(res.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userData]);

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-gray-100"
          >
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <BsShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Sign In to View Dashboard
            </h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Track your AI mock interview analytics, progress charts, and performance insights in one place.
            </p>
            <button
              onClick={() => setShowAuth(true)}
              className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition shadow-md cursor-pointer"
            >
              Sign In / Try Demo
            </button>
          </motion.div>
        </div>
        {showAuth && <AuthModel onclose={() => setShowAuth(false)} />}
        <Footer />
      </div>
    );
  }

  const chartData = analytics?.chartData || [];
  const hasCompletedInterviews = (analytics?.completedInterviews || 0) > 0;

  const competencyData = [
    { name: "Confidence", score: analytics?.avgConfidence || 0 },
    { name: "Communication", score: analytics?.avgCommunication || 0 },
    { name: "Correctness", score: analytics?.avgCorrectness || 0 },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* WELCOME HERO BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-900 via-gray-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 mb-3 border border-emerald-500/30">
              <BsLightningCharge /> Performance Dashboard
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {userData.name || "Candidate"}!
            </h1>
            <p className="text-gray-300 mt-2 text-sm sm:text-base leading-relaxed">
              Review your interview preparedness, analyze competency trends, and sharpen your skills with AI simulations.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 relative z-10 w-full md:w-auto">
            <button
              onClick={() => navigate("/interview")}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold px-6 py-3.5 rounded-full transition shadow-lg hover:shadow-emerald-500/25 cursor-pointer"
            >
              <FaMicrophoneAlt /> Start Interview
            </button>
            <button
              onClick={() => navigate("/pricing")}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-3.5 rounded-full border border-white/20 transition cursor-pointer"
            >
              <BsCoin className="text-amber-300" /> Refill Credits
            </button>
          </div>
        </motion.div>

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            {
              title: "Average Score",
              value: hasCompletedInterviews ? `${analytics?.avgScore || 0}%` : "--",
              desc: "Overall performance metric",
              icon: <BsTrophy className="text-amber-500" size={22} />,
              bg: "bg-amber-50",
            },
            {
              title: "Interviews Completed",
              value: analytics?.completedInterviews || 0,
              desc: `${analytics?.totalInterviews || 0} total started`,
              icon: <BsClockHistory className="text-blue-500" size={22} />,
              bg: "bg-blue-50",
            },
            {
              title: "Communication Rating",
              value: hasCompletedInterviews ? `${analytics?.avgCommunication || 0}/100` : "--",
              desc: "Clarity & articulation",
              icon: <FaUserTie className="text-emerald-500" size={20} />,
              bg: "bg-emerald-50",
            },
            {
              title: "Available Credits",
              value: userData.credits || 0,
              desc: "50 credits per mock round",
              icon: <BsCoin className="text-yellow-500" size={22} />,
              bg: "bg-yellow-50",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>{stat.icon}</div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CHARTS SECTION */}
        {hasCompletedInterviews ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* SCORE PROGRESSION CHART (2 COLS) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Score Progression</h2>
                  <p className="text-xs text-gray-400">Trajectory across recent sessions</p>
                </div>
                <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                  Target: 80%+
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        borderRadius: "12px",
                        color: "#fff",
                        border: "none",
                        fontSize: "12px",
                      }}
                      formatter={(val) => [`${val}%`, "Final Score"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#scoreGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* COMPETENCY BREAKDOWN (1 COL) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Competency Metrics</h2>
                <p className="text-xs text-gray-400 mb-6">Average across answered questions</p>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={competencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          borderRadius: "12px",
                          color: "#fff",
                          border: "none",
                        }}
                        formatter={(val) => [`${val}/100`, "Rating"]}
                      />
                      <Bar dataKey="score" fill="#10b981" radius={[8, 8, 0, 0]} barSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Technical: <strong className="text-gray-800">{analytics?.modeBreakdown?.Technical || 0}</strong></span>
                <span>HR Behavioral: <strong className="text-gray-800">{analytics?.modeBreakdown?.HR || 0}</strong></span>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl p-10 sm:p-14 border border-dashed border-gray-300 text-center mb-8 shadow-sm"
          >
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <FaChartLine size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Interview Analytics Yet
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base mb-8 leading-relaxed">
              Complete your first AI mock interview to generate personalized score trajectory graphs, communication assessments, and competency breakdowns.
            </p>
            <button
              onClick={() => navigate("/interview")}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-full transition shadow-md cursor-pointer"
            >
              Launch First Interview <BsArrowRight />
            </button>
          </motion.div>
        )}

        {/* RECENT INTERVIEWS LIST */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Interview Sessions</h2>
              <p className="text-xs text-gray-400">Past rounds and performance outcomes</p>
            </div>
            <button
              onClick={() => navigate("/history")}
              className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1.5 cursor-pointer"
            >
              View Full History <BsArrowRight />
            </button>
          </div>

          {analytics?.recentInterviews && analytics.recentInterviews.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {analytics.recentInterviews.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/report/${item._id}`)}
                  className="py-4 flex items-center justify-between flex-wrap gap-4 hover:bg-gray-50/80 px-3 -mx-3 rounded-xl transition cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-700">
                      {item.mode === "HR" ? "HR" : "Tech"}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{item.role}</h3>
                      <p className="text-xs text-gray-400">
                        {item.experience} • {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-base font-bold text-emerald-600">
                        {item.finalScore != null ? `${item.finalScore}/100` : "--"}
                      </span>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Score</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "Completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm py-4 text-center">
              No interview records logged. Start a session above!
            </p>
          )}
        </div>

        {/* AI PREPARATION TIPS */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-600 text-white p-2.5 rounded-xl">
              <BsLightningCharge size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">AI Preparation Insights</h3>
              <p className="text-xs text-gray-600">Actionable advice tailored for interview success</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm mb-1">
                <BsCheckCircleFill size={14} /> Structure with STAR
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Frame behavioral answers using Situation, Task, Action, and Result to boost communication & correctness scores.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm mb-1">
                <BsCheckCircleFill size={14} /> Pacing & Tone
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Take a 2-second pause before responding. A steady tempo demonstrates composure and elevates confidence ratings.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm mb-1">
                <BsCheckCircleFill size={14} /> Quantify Achievements
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Mention concrete metrics (latency reduced by 30%, user base grew by 2x) to stand out during technical evaluations.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
