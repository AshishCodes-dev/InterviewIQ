import React, { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { BsPersonCheckFill } from "react-icons/bs";
import { auth, provider } from "../utils/firebase.js";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { ServerUrl } from "../App.jsx";
import { setUserData } from "../redux/userSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Auth = ({ isModal = false, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleAuth = async () => {
    try {
      setLoadingGoogle(true);
      setErrorMsg("");
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const name = user.displayName;
      const email = user.email;

      const result = await axios.post(
        `${ServerUrl}/api/auth/google`,
        { name, email },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));

      if (onSuccess) {
        onSuccess();
      } else if (!isModal) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google authentication failed:", error);
      setErrorMsg("Google sign-in was cancelled or failed. Try Demo Guest login!");
      dispatch(setUserData(null));
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleDemoAuth = async () => {
    try {
      setLoadingDemo(true);
      setErrorMsg("");
      const result = await axios.post(
        `${ServerUrl}/api/auth/demo`,
        {},
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));

      if (onSuccess) {
        onSuccess();
      } else if (!isModal) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Demo login failed:", error);
      setErrorMsg("Failed to start demo session. Please try again.");
    } finally {
      setLoadingDemo(false);
    }
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, y: isModal ? 0 : -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl border border-gray-200 text-center"
    >
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="bg-black text-white p-2 rounded-xl">
          <FaRobot size={18} />
        </div>
        <h2 className="font-bold text-xl tracking-tight text-gray-900">
          Interview<span className="text-emerald-600">IQ</span>.AI
        </h2>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-3">
        Continue with{" "}
        <span className="bg-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full inline-flex items-center gap-1.5 text-lg align-middle">
          <HiSparkles size={16} /> AI Smart Interview
        </span>
      </h1>

      <p className="text-gray-500 text-sm leading-relaxed mb-6">
        Sign in to practice voice-based mock interviews, get instant AI evaluation, and track your competencies.
      </p>

      {errorMsg && (
        <div className="mb-4 text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* 1-CLICK DEMO LOGIN (PORTFOLIO REVIEW HIGHLIGHT) */}
      <motion.button
        onClick={handleDemoAuth}
        disabled={loadingDemo || loadingGoogle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-md transition mb-3 cursor-pointer disabled:opacity-60"
      >
        <BsPersonCheckFill size={18} />
        {loadingDemo ? "Starting Demo..." : "Explore as Demo Guest (1-Click)"}
      </motion.button>

      <div className="flex items-center my-4">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="px-3 text-xs text-gray-400 font-medium uppercase">Or</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* GOOGLE LOGIN */}
      <motion.button
        onClick={handleGoogleAuth}
        disabled={loadingDemo || loadingGoogle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-3 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-2xl border border-gray-300 shadow-xs transition cursor-pointer disabled:opacity-60"
      >
        <FcGoogle size={20} />
        {loadingGoogle ? "Connecting Google..." : "Continue with Google"}
      </motion.button>

      <p className="text-[11px] text-gray-400 mt-5">
        By continuing, you agree to InterviewIQ's Terms of Service and Privacy Policy.
      </p>
    </motion.div>
  );

  if (isModal) {
    return content;
  }

  return (
    <div className="w-full min-h-screen bg-[#f3f3f3] flex items-center justify-center px-4 py-16">
      {content}
    </div>
  );
};

export default Auth;
