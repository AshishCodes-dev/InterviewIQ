import React, { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
  FaArrowLeft,
  FaExclamationTriangle,
} from "react-icons/fa";
import { BsCoin, BsCheckCircleFill } from "react-icons/bs";
import { ServerUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const ROLE_PRESETS = [
  { role: "Full Stack Developer", exp: "2 years", mode: "Technical" },
  { role: "Frontend Engineer (React)", exp: "1-3 years", mode: "Technical" },
  { role: "Backend Engineer (Node.js)", exp: "3 years", mode: "Technical" },
  { role: "Product & HR Round", exp: "2 years", mode: "HR" },
  { role: "AI / Machine Learning Engineer", exp: "2 years", mode: "Technical" },
];

const Step1StepUp = ({ onStart }) => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [interviewerGender, setInterviewerGender] = useState("female");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const userCredits = userData?.credits ?? 100;
  const hasEnoughCredits = userCredits >= 50;

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/resume",
        formData,
        { withCredentials: true }
      );

      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProject(result.data.project || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
    } catch (error) {
      console.error("Resume analysis error:", error);
      setErrorMessage("Failed to parse resume. You can enter your role and experience manually.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    if (loading) return;
    if (!hasEnoughCredits) {
      setErrorMessage("Insufficient credits. Minimum 50 credits required.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const result = await axios.post(
        `${ServerUrl}/api/interview/generate-question`,
        { role, experience, mode, resumeText, project, skills },
        { withCredentials: true }
      );

      if (userData) {
        dispatch(
          setUserData({
            ...userData,
            credits: result.data.creditsLeft,
          })
        );
      }

      onStart({
        ...result.data,
        interviewerGender,
      });
    } catch (error) {
      console.error("Failed to generate questions:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to start interview. Please check your connection and API key."
      );
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset) => {
    setRole(preset.role);
    setExperience(preset.exp);
    setMode(preset.mode);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8fafc] px-4 py-8">
      {/* TOP NAV BAR */}
      <div className="w-full max-w-5xl mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition cursor-pointer"
        >
          <FaArrowLeft /> Back to Home
        </button>

        {userData && (
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
            <BsCoin className="text-amber-500" size={15} />
            <span>{userData.credits || 0} Credits</span>
          </div>
        )}
      </div>

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-gray-100 grid md:grid-cols-2 overflow-hidden">
        {/* LEFT COLUMN - HERO INTRO */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-950 text-white p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 mb-4 border border-emerald-500/30">
              <FaMicrophoneAlt /> Step 1: Session Setup
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              AI Mock Simulation Setup
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              Configure your desired role, seniority, and mode. Our AI generates realistic, scenario-based interview questions tailored to your profile.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: <FaUserTie className="text-emerald-400" size={18} />,
                  title: "Targeted Question Generation",
                  desc: "Adaptive difficulty from easy to advanced rounds",
                },
                {
                  icon: <FaMicrophoneAlt className="text-emerald-400" size={18} />,
                  title: "Real-Time Audio Simulation",
                  desc: "Interactive voice avatar with timed responses",
                },
                {
                  icon: <FaChartLine className="text-emerald-400" size={18} />,
                  title: "Comprehensive Evaluation",
                  desc: "Confidence, communication, and correctness scoring",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3.5 bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10"
                >
                  <div className="p-2 rounded-xl bg-white/10 shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-gray-400 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-gray-500 mt-8">
            50 credits deducted per 5-question completed simulation.
          </p>
        </div>

        {/* RIGHT COLUMN - SETUP FORM */}
        <div className="p-8 sm:p-12 bg-white flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Configure Interview</h3>
            <p className="text-xs text-gray-400 mb-6">
              Pick a quick role preset or upload your resume for automatic customization.
            </p>

            {/* LOW CREDIT WARNING */}
            {!hasEnoughCredits && (
              <div className="mb-5 bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-800">
                <div className="flex items-center gap-2">
                  <FaExclamationTriangle className="text-amber-600 shrink-0" />
                  <span>You have {userCredits} credits. (50 needed)</span>
                </div>
                <button
                  onClick={() => navigate("/pricing")}
                  className="font-bold underline text-amber-900 hover:text-black cursor-pointer"
                >
                  Refill Now
                </button>
              </div>
            )}

            {/* ERROR BANNER */}
            {errorMessage && (
              <div className="mb-5 bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-700 font-medium">
                {errorMessage}
              </div>
            )}

            {/* PRESETS CHIPS */}
            <div className="mb-5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Quick Role Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ROLE_PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="text-[11px] font-semibold bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 px-3 py-1.5 rounded-full transition cursor-pointer"
                  >
                    + {preset.role}
                  </button>
                ))}
              </div>
            </div>

            {/* FORM INPUTS */}
            <div className="space-y-4">
              <div className="relative">
                <FaUserTie className="absolute top-3.5 left-4 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Target Job Role (e.g. React Frontend Engineer)"
                  className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                />
              </div>

              <div className="relative">
                <FaBriefcase className="absolute top-3.5 left-4 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Experience Level (e.g. 2 years / Junior / Senior)"
                  className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  onChange={(e) => setExperience(e.target.value)}
                  value={experience}
                />
              </div>

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full py-3 px-4 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
              >
                <option value="Technical">Technical Round (Coding & Architecture)</option>
                <option value="HR">HR Behavioral Round (Culture & Leadership)</option>
              </select>

              {/* AI INTERVIEWER AVATAR SELECTION */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Choose AI Interviewer Avatar:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInterviewerGender("female")}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition cursor-pointer text-left ${
                      interviewerGender === "female"
                        ? "border-emerald-500 bg-emerald-50/60 shadow-xs"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-base shrink-0">
                      👩
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Sophia (Female)</p>
                      <p className="text-[10px] text-gray-500">Natural & warm voice</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInterviewerGender("male")}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition cursor-pointer text-left ${
                      interviewerGender === "male"
                        ? "border-emerald-500 bg-emerald-50/60 shadow-xs"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base shrink-0">
                      👨
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">David (Male)</p>
                      <p className="text-[10px] text-gray-500">Direct & professional</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* RESUME UPLOAD SECTION */}
              {!analysisDone ? (
                <div
                  onClick={() => document.getElementById("resumeInput").click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/40 transition p-6"
                >
                  <input
                    id="resumeInput"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                  <FaFileUpload className="text-2xl text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-700">
                    {resumeFile ? resumeFile.name : "Upload Resume (Optional PDF)"}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    AI tailors questions to your projects and tech stack
                  </p>

                  {resumeFile && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadResume();
                      }}
                      disabled={analyzing}
                      className="mt-3 bg-gray-900 hover:bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition shadow-xs"
                    >
                      {analyzing ? "Analyzing Resume..." : "Extract Resume Details"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2">
                    <BsCheckCircleFill /> Resume Analyzed Successfully
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {skills.slice(0, 6).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleStart}
              disabled={!role.trim() || !experience.trim() || loading || !hasEnoughCredits}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold rounded-2xl shadow-md transition duration-200 cursor-pointer disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                "Preparing Questions with AI..."
              ) : (
                <>
                  <FaMicrophoneAlt /> Start Interview (50 Credits)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1StepUp;
