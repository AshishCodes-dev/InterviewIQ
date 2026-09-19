import React from "react";
import { BsRobot, BsGithub, BsHeartFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#f3f3f3] flex justify-center px-4 pb-10 pt-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xs border border-gray-200 py-8 px-6 text-center">
        <div className="flex justify-center items-center gap-3 mb-3">
          <div className="bg-black text-white p-2 rounded-xl">
            <BsRobot size={16} />
          </div>
          <h2 className="font-bold text-gray-900 tracking-tight text-base">
            Interview<span className="text-emerald-600">IQ</span>.AI
          </h2>
        </div>

        <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed mb-5">
          AI-powered mock interview platform engineered to elevate communication skills, technical depth, and candidate confidence.
        </p>

        {/* QUICK NAVIGATION LINKS */}
        <div className="flex justify-center items-center gap-6 text-xs font-semibold text-gray-600 mb-6 flex-wrap">
          <Link to="/" className="hover:text-emerald-600 transition">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-emerald-600 transition">
            Dashboard
          </Link>
          <Link to="/interview" className="hover:text-emerald-600 transition">
            Practice
          </Link>
          <Link to="/history" className="hover:text-emerald-600 transition">
            History
          </Link>
          <Link to="/pricing" className="hover:text-emerald-600 transition">
            Credit Store
          </Link>
        </div>

        <div className="h-px bg-gray-100 max-w-md mx-auto mb-4" />

        <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
          Built with <BsHeartFill className="text-red-500" size={10} /> for job seekers & tech interviews
        </p>
      </div>
    </footer>
  );
};

export default Footer;
