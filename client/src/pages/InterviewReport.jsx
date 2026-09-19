import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import { FaArrowLeft, FaDownload, FaRedo, FaTrophy } from "react-icons/fa";
import { BsCheckCircleFill, BsLightningCharge, BsSpeedometer2 } from "react-icons/bs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const scoreColor = (score) => {
  if (score >= 75) return "text-emerald-600";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
};

const scoreBg = (score) => {
  if (score >= 75) return "bg-emerald-100 text-emerald-700";
  if (score >= 50) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

const InterviewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getReport = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          `${ServerUrl}/api/interview/report/${id}`,
          { withCredentials: true }
        );
        setReport(result.data);
      } catch (err) {
        console.error("Failed to load interview report:", err);
        setError("Failed to load this interview report. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getReport();
  }, [id]);

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    const dateStr = new Date(report?.createdAt || Date.now()).toISOString().slice(0, 10);
    const roleSlug = (report?.role || "Interview").replace(/[^a-zA-Z0-9]/g, "_");
    document.title = `InterviewIQ_${roleSlug}_Report_${dateStr}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Generating comprehensive report...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-gray-600 font-medium mb-4">{error || "Report not found."}</p>
          <button
            onClick={() => navigate("/history")}
            className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-semibold text-xs shadow hover:bg-emerald-700 transition cursor-pointer"
          >
            Back to Interview History
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const stats = [
    { label: "Confidence", value: report.confidence, desc: "Tone, clarity & presence" },
    { label: "Communication", value: report.communication, desc: "Language & articulation" },
    { label: "Technical Depth", value: report.correctness, desc: "Relevance & accuracy" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* TOP BAR / NAVIGATION */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/history")}
              className="p-3 rounded-full bg-white shadow-xs hover:shadow-md border border-gray-200 transition cursor-pointer"
              title="Back to History"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Interview Evaluation Report
                </h1>
                {report.mode && (
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {report.mode} Mode
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                {[report.role, report.experience].filter(Boolean).join(" • ") ||
                  "Detailed session performance breakdown"}
                {report.createdAt &&
                  ` • ${new Date(report.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
            >
              <FaDownload /> Download / Save PDF
            </button>
            <button
              onClick={() => navigate("/interview")}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
            >
              <FaRedo /> Practice Again
            </button>
          </div>
        </div>

        {/* PRINTABLE HEADER FOR PRINT MODE */}
        <div className="hidden print:block mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">InterviewIQ — Candidate Evaluation Report</h1>
          <p className="text-sm text-gray-600">
            Role: {report.role} | Mode: {report.mode} | Experience: {report.experience} | Date: {new Date(report.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>

        {/* OVERALL SCORE & COMPETENCY CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="md:border-r md:border-gray-100 md:pr-6 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Overall Rating
              </span>
              <div className="flex items-baseline justify-center md:justify-start gap-1 my-1">
                <span className={`text-5xl font-black ${scoreColor(report.finalScore)}`}>
                  {report.finalScore ?? "--"}
                </span>
                <span className="text-gray-400 text-lg font-bold">/100</span>
              </div>
              <p className="text-xs text-gray-400">Weighted aggregated score</p>
            </div>

            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-center sm:text-left"
                >
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-extrabold my-1 ${scoreColor(stat.value)}`}>
                    {stat.value ?? "--"}/100
                  </p>
                  <p className="text-[11px] text-gray-400">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QUESTION-BY-QUESTION BREAKDOWN */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Question-by-Question Analysis
            </h2>
            <span className="text-xs text-gray-400 font-medium">
              {report.questionWiseScore?.length || 0} Questions Evaluated
            </span>
          </div>

          {report.questionWiseScore && report.questionWiseScore.length > 0 ? (
            <div className="space-y-4">
              {report.questionWiseScore.map((q, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div className="flex-1 min-w-[240px]">
                      <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-md mb-2">
                        Question {index + 1}
                      </span>
                      <h3 className="text-base font-semibold text-gray-900 leading-snug">
                        {q.question}
                      </h3>
                    </div>

                    <span
                      className={`px-3.5 py-1 rounded-full text-xs font-black shrink-0 ${scoreBg(
                        q.score
                      )}`}
                    >
                      {q.score ?? 0}/100
                    </span>
                  </div>

                  {/* SUB-METRICS */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-50 flex-wrap">
                    <span>
                      Confidence: <strong className="text-gray-700">{q.confidence ?? 0}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Communication: <strong className="text-gray-700">{q.communication ?? 0}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Correctness: <strong className="text-gray-700">{q.correctness ?? 0}</strong>
                    </span>
                  </div>

                  {/* AI FEEDBACK */}
                  {q.feedback && (
                    <div className="mt-3.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 leading-relaxed">
                      <strong>AI Interviewer Note:</strong> {q.feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm border border-gray-100">
              No question evaluation details available for this session.
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex items-center justify-center gap-4 flex-wrap print:hidden">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 shadow-xs hover:shadow-md text-gray-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
          >
            <BsSpeedometer2 /> Return to Dashboard
          </button>
          <button
            onClick={() => navigate("/interview")}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
          >
            <FaRedo /> Start New Simulation
          </button>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default InterviewReport;
