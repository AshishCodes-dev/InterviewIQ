import React from "react";
import { useNavigate } from "react-router-dom";
import { FaDownload, FaRedo, FaHistory } from "react-icons/fa";
import { BsSpeedometer2, BsCheckCircleFill } from "react-icons/bs";

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

const Step3Interview = ({ report }) => {
  const navigate = useNavigate();

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <p className="text-gray-400 text-sm">Loading session results...</p>
      </div>
    );
  }

  const {
    finalScore,
    confidence,
    communication,
    correctness,
    questionWiseScore,
    userName,
  } = report;

  const stats = [
    { label: "Confidence", value: confidence, desc: "Tone & presence" },
    { label: "Communication", value: communication, desc: "Clarity & articulation" },
    { label: "Technical Depth", value: correctness, desc: "Relevance & accuracy" },
  ];

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    const dateStr = new Date().toISOString().slice(0, 10);
    document.title = `InterviewIQ_Evaluation_Report_${dateStr}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-3">
            <BsCheckCircleFill size={13} /> Simulation Complete
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Great Job, {userName || "Candidate"}!
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Here is your AI interviewer's performance assessment and constructive feedback.
          </p>
        </div>

        {/* OVERALL SCORE CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="text-center md:text-left md:border-r md:border-gray-100 md:pr-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Final Score
              </p>
              <div className="flex items-baseline justify-center md:justify-start gap-1 my-1">
                <span className={`text-5xl font-black ${scoreColor(finalScore)}`}>
                  {finalScore ?? "--"}
                </span>
                <span className="text-gray-400 text-lg font-bold">/100</span>
              </div>
              <p className="text-xs text-gray-400">Overall round performance</p>
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
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Question Feedback & Breakdown
          </h2>

          {questionWiseScore && questionWiseScore.length > 0 ? (
            <div className="space-y-4">
              {questionWiseScore.map((q, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                    <div className="flex-1 min-w-[200px]">
                      <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-md mb-2">
                        Question {index + 1}
                      </span>
                      <p className="text-base font-semibold text-gray-900">
                        {q.question}
                      </p>
                    </div>

                    <span
                      className={`px-3.5 py-1 rounded-full text-xs font-black shrink-0 ${scoreBg(
                        q.score
                      )}`}
                    >
                      {q.score ?? 0}/100
                    </span>
                  </div>

                  <div className="flex gap-4 text-xs text-gray-500 pt-2 border-t border-gray-50 flex-wrap">
                    <span>Confidence: <strong className="text-gray-700">{q.confidence ?? 0}</strong></span>
                    <span>•</span>
                    <span>Communication: <strong className="text-gray-700">{q.communication ?? 0}</strong></span>
                    <span>•</span>
                    <span>Correctness: <strong className="text-gray-700">{q.correctness ?? 0}</strong></span>
                  </div>

                  {q.feedback && (
                    <div className="mt-3.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900">
                      <strong>Interviewer Assessment:</strong> {q.feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm border border-gray-100">
              No question evaluation details available.
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-center gap-3 flex-wrap print:hidden">
          <button
            onClick={handleDownloadPDF}
            className="px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <FaDownload /> Download / Save PDF
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <BsSpeedometer2 /> Dashboard
          </button>
          <button
            onClick={() => navigate("/history")}
            className="px-5 py-3 rounded-xl bg-white border border-gray-200 shadow-xs hover:shadow-md text-gray-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
          >
            <FaHistory /> Past Interviews
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <FaRedo /> Practice Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3Interview;
