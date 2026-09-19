import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "motion/react";
import { BsRobot, BsCoin, BsSpeedometer2 } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut, FaHistory, FaCreditCard } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import AuthModel from "../components/AuthModel.jsx";

const Navbar = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuth, setShowAuth] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    setShowUserPopup(false);
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard", authRequired: true },
    { label: "Practice", path: "/interview" },
    { label: "History", path: "/history", authRequired: true },
    { label: "Pricing", path: "/pricing" },
  ];

  return (
    <div className="bg-[#f3f3f3] flex justify-center px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-sm border border-gray-200 px-6 sm:px-8 py-3.5 flex justify-between items-center relative z-40"
      >
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="bg-black text-white p-2 rounded-xl shadow-sm">
            <BsRobot size={18} />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            Interview<span className="text-emerald-600">IQ</span>
          </span>
        </div>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => {
                  if (link.authRequired && !userData) {
                    setShowAuth(true);
                  } else {
                    navigate(link.path);
                  }
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-3 sm:gap-4 relative">
          {/* CREDITS PILL */}
          <div className="relative">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                setShowCreditPopup(!showCreditPopup);
                setShowUserPopup(false);
              }}
              className="flex items-center gap-1.5 cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition text-gray-800"
            >
              <BsCoin size={16} className="text-amber-500" />
              <span>{userData?.credits || 0}</span>
            </button>

            {showCreditPopup && (
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl border border-gray-100 rounded-2xl p-5 z-50">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Credit Balance
                </p>
                <p className="text-2xl font-extrabold text-gray-900 mb-2">
                  {userData?.credits || 0}{" "}
                  <span className="text-xs font-normal text-gray-500">Credits</span>
                </p>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Each AI mock round costs 50 credits. Refill anytime to keep practicing.
                </p>
                <button
                  onClick={() => {
                    setShowCreditPopup(false);
                    navigate("/pricing");
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Refill Credits
                </button>
              </div>
            )}
          </div>

          {/* USER AVATAR / PROFILE DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                setShowUserPopup(!showUserPopup);
                setShowCreditPopup(false);
              }}
              className="w-9 h-9 bg-gray-900 hover:bg-black text-white rounded-full flex items-center justify-center font-bold text-sm shadow-xs transition cursor-pointer"
            >
              {userData ? (
                userData?.name?.slice(0, 1).toUpperCase()
              ) : (
                <FaUserAstronaut size={15} />
              )}
            </button>

            {showUserPopup && (
              <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl border border-gray-100 rounded-2xl py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {userData?.name || userData?.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowUserPopup(false);
                    navigate("/dashboard");
                  }}
                  className="w-full text-left text-xs font-medium px-4 py-2.5 hover:bg-gray-50 text-gray-700 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <BsSpeedometer2 size={14} className="text-emerald-600" />
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    setShowUserPopup(false);
                    navigate("/history");
                  }}
                  className="w-full text-left text-xs font-medium px-4 py-2.5 hover:bg-gray-50 text-gray-700 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <FaHistory size={14} className="text-blue-500" />
                  Interview History
                </button>

                <button
                  onClick={() => {
                    setShowUserPopup(false);
                    navigate("/pricing");
                  }}
                  className="w-full text-left text-xs font-medium px-4 py-2.5 hover:bg-gray-50 text-gray-700 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <FaCreditCard size={14} className="text-amber-500" />
                  Credit Store
                </button>

                <div className="h-px bg-gray-100 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex text-left items-center text-xs font-medium gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 transition cursor-pointer"
                >
                  <HiOutlineLogout size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {showAuth && <AuthModel onclose={() => setShowAuth(false)} />}
    </div>
  );
};

export default Navbar;
