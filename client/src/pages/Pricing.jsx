import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import {
  BsCoin,
  BsCheckCircleFill,
  BsLightningCharge,
  BsShieldCheck,
  BsStars,
} from "react-icons/bs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModel from "../components/AuthModel";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";

const Pricing = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingPlan, setLoadingPlan] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddCredits = async (amount, planName) => {
    if (!userData) {
      setShowAuth(true);
      return;
    }

    setLoadingPlan(planName);
    setSuccessMessage("");

    try {
      const response = await axios.post(
        `${ServerUrl}/api/user/add-credits`,
        { amount },
        { withCredentials: true }
      );

      if (response.data?.user) {
        dispatch(setUserData(response.data.user));
      } else if (response.data?.credits != null) {
        dispatch(
          setUserData({
            ...userData,
            credits: response.data.credits,
          })
        );
      }

      setSuccessMessage(`Successfully added ${amount} credits to your account!`);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      console.error("Failed to add credits:", error);
      alert(error.response?.data?.message || "Failed to refill credits.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      name: "Starter Refill",
      badge: "Free Daily Top-up",
      credits: 100,
      interviews: "2 Mock Sessions",
      price: "Free",
      description: "Great for a quick practice run before your interview.",
      features: [
        "100 AI credits (2 Full Rounds)",
        "Both Technical & HR modes",
        "Natural speech voice interviewer",
        "Question-by-question scoring",
        "Basic performance feedback",
      ],
      cta: "Claim 100 Credits",
      popular: false,
      amount: 100,
      highlight: "border-gray-200",
    },
    {
      name: "Pro Candidate",
      badge: "Most Popular",
      credits: 500,
      interviews: "10 Mock Sessions",
      price: "$9",
      period: "one-time",
      description: "Ideal for candidates actively preparing for upcoming job rounds.",
      features: [
        "500 AI credits (10 Full Rounds)",
        "Resume-driven personalized questions",
        "Detailed STAR feedback breakdown",
        "Performance analytics & trend charts",
        "Printable PDF report export",
        "Full interview history tracking",
      ],
      cta: "Top Up 500 Credits",
      popular: true,
      amount: 500,
      highlight: "border-emerald-500 shadow-xl",
    },
    {
      name: "Mastery Bundle",
      badge: "Best Value",
      credits: 1500,
      interviews: "30 Mock Sessions",
      price: "$19",
      period: "one-time",
      description: "Comprehensive preparation package for serious job seekers.",
      features: [
        "1,500 AI credits (30 Full Rounds)",
        "Deep technical architecture questions",
        "Unlimited resume uploads & parsing",
        "Comprehensive competency analytics",
        "Full PDF report downloads",
        "Priority AI model response time",
        "Credits never expire",
      ],
      cta: "Top Up 1,500 Credits",
      popular: false,
      amount: 1500,
      highlight: "border-gray-200",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
            <BsStars /> Credit Store & Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Invest in Your Career with <span className="text-emerald-600">InterviewIQ</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
            Each full 5-question AI interview session consumes 50 credits. Refill your balance anytime with instant top-ups.
          </p>

          {/* CURRENT BALANCE BANNER */}
          {userData && (
            <div className="mt-6 inline-flex items-center gap-3 bg-white px-6 py-2.5 rounded-full border border-gray-200 shadow-sm">
              <span className="text-sm text-gray-500 font-medium">Your Balance:</span>
              <span className="inline-flex items-center gap-1.5 font-bold text-gray-900 text-base">
                <BsCoin className="text-amber-500" size={18} />
                {userData.credits || 0} Credits
              </span>
              <span className="text-xs text-gray-400">
                (~{Math.floor((userData.credits || 0) / 50)} interviews left)
              </span>
            </div>
          )}

          {/* SUCCESS BANNER */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-xl text-sm font-medium inline-block"
            >
              {successMessage}
            </motion.div>
          )}
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-3xl p-8 border-2 ${plan.highlight} flex flex-col justify-between relative transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                    {plan.badge}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-6 min-h-[32px]">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-xs text-gray-400 font-medium">/{plan.period}</span>
                  )}
                </div>

                <div className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-sm mb-6">
                  <BsLightningCharge size={14} />
                  <span>{plan.credits} Credits ({plan.interviews})</span>
                </div>

                <div className="h-px bg-gray-100 mb-6" />

                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <BsCheckCircleFill className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleAddCredits(plan.amount, plan.name)}
                disabled={loadingPlan === plan.name}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                  plan.popular
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-emerald-500/25"
                    : "bg-gray-900 hover:bg-black text-white"
                } disabled:opacity-50`}
              >
                {loadingPlan === plan.name ? "Refilling..." : plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ ACCORDION */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "How many credits does an interview require?",
                a: "Each interview session costs 50 credits. This includes AI question generation tailored to your background, speech audio evaluation, real-time feedback, and a comprehensive downloadable report.",
              },
              {
                q: "Do purchased credits expire?",
                a: "Never. Your credits remain safe in your account indefinitely until you choose to practice.",
              },
              {
                q: "Can I upload my resume multiple times?",
                a: "Yes! You can upload different versions of your resume for different job titles (e.g. Full Stack, Backend, Frontend). The AI adapts question depth according to each specific resume.",
              },
              {
                q: "Is there a free tier for testing?",
                a: "Yes! Every new user receives 100 free credits upon signup, and you can claim the Starter Refill anytime right from this page to keep practicing.",
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
                <h4 className="text-base font-semibold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showAuth && <AuthModel onclose={() => setShowAuth(false)} />}
      <Footer />
    </div>
  );
};

export default Pricing;
