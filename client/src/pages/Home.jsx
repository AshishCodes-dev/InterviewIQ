import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModel from "../components/AuthModel";
import Footer from "../components/Footer";

import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";
import hrImg from "../assets/images/hr.png";
import technialImg from "../assets/images/technial.png";
import confidenceImg from "../assets/images/confidence.png";
import creditImg from "../assets/images/credit.png";
import aiAnsImg from "../assets/images/ai-ans.png";
import resumeImg from "../assets/images/resume.png";
import pdfImg from "../assets/images/pdf.png";
import historyImg from "../assets/images/history.png";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
      <Navbar />

      <div className="flex-1 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2">
              <HiSparkles size={16} className="text-green-600" />
              AI Powered Smart Interview
            </div>
          </div>

          <div className="text-center mb-28">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto"
            >
              Practice Interview With
              <span className="relative inline-block">
                <span className="bg-green-100 text-green-600 px-5 py-1 rounded-full">
                  AI Intelligence
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg"
            >
              Role-based mock interview with smart AI, track your progress, and
              detailed performance insights.
            </motion.p>

            <div className="flex justify-center gap-4 mt-10">
              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full max-w-md bg-black text-white py-3 rounded-full hover:opacity-90 transition shadow-md"
              >
                Start Interview
              </motion.button>

              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/dashboard");
                }}
                whileHover={{ opacity: 0.9, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className="border border-gray-300 px-8 py-3 rounded-full hover:bg-gray-100 transition shadow-md cursor-pointer font-medium"
              >
                Dashboard
              </motion.button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-28">
            {[
              {
                icon: <BsRobot size={24} />,
                step: "STEP 1",
                title: "Role & Experience selection",
                description:
                  "AI adjusts difficulty based on selected job role.",
              },
              {
                icon: <BsMic size={24} />,
                step: "STEP 2",
                title: "Smart Voice Interview",
                description: "Audio interview with smart AI",
              },
              {
                icon: <BsClock size={24} />,
                step: "STEP 3",
                title: "Timer Based Simulation",
                description: "Real interview pressure with time tracking",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ rotate: 0, scale: 1.06 }}
                className={`relative bg-white rounded-3xl border-2 border-green-100 hover:border-green-500 p-10 w-80 max-w-[90%] shadow-md hover:shadow-2xl transition-all duration-300
                ${index === 0 ? "-rotate-4" : ""}
                ${index === 1 ? "rotate-3 md:-mt-6 shadow-xl" : ""}
                ${index === 2 ? "-rotate-3" : ""}
              `}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border border-green-500 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                  {item.icon}
                </div>

                <p className="text-xs font-semibold text-green-600 text-center mb-2 tracking-wider">
                  {item.step}
                </p>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mb-32">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-semibold text-center mb-16"
            >
              Advanced AI <span className="text-green-600">Capabilities</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-10">
              {[
                {
                  image: aiAnsImg,
                  icon: <BsBarChart size={20} />,
                  title: "AI Answer Evaluation",
                  des: "Score communication, technical accuracy, and confidence",
                },
                {
                  image: resumeImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Resume Based Interview",
                  des: "Project-specific questions based on uploaded resume",
                },
                {
                  image: pdfImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Downloadable PDF Report",
                  des: "Detailed strengths, weaknesses and improvements",
                },
                {
                  image: historyImg,
                  icon: <BsBarChart size={20} />,
                  title: "History & Analytics",
                  des: "Track progress with performance graphs and topic analysis",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2 justify-center flex">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-auto object-contain max-h-64"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <div className="bg-green-50 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                        {item.icon}
                      </div>
                      <h3 className="font-semibold mb-3 text-xl">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {item.des}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-32">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-semibold text-center mb-16"
            >
              Multiple Interview <span className="text-green-600">Modes</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-10">
              {[
                {
                  image: hrImg,
                  title: "HR Interview Mode",
                  des: "Behavioral and situational questions like a real HR round",
                },
                {
                  image: technialImg,
                  title: "Technical Mode",
                  des: "Deep technical questioning based on selected role",
                },
                {
                  image: confidenceImg,
                  title: "Confidence Detection",
                  des: "Based on tone and voice analysis insights",
                },
                {
                  image: creditImg,
                  title: "Flexible Credit System",
                  des: "Unlock premium interview sessions easily",
                },
              ].map((mode, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2">
                      <h3 className="font-semibold text-xl mb-3">
                        {mode.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {mode.des}
                      </p>
                    </div>

                    <div className="w-full md:w-1/2 justify-end flex">
                      <img
                        src={mode.image}
                        alt={mode.title}
                        className="w-28 h-28 object-contain"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAuth && <AuthModel onclose={() => setShowAuth(false)} />}

        <Footer />
    </div>
  );
};

export default Home;
