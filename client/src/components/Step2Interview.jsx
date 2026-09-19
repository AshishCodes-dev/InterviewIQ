import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import femalevideo from "../assets/video/female.ai.mp4";
import malevideo from "../assets/video/male.ai.mp4";
import Timer from "./Timer";
import { motion } from "motion/react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaVolumeUp,
  FaTimes,
} from "react-icons/fa";
import { ServerUrl } from "../App";
import { useNavigate } from "react-router-dom";

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, userName, questions = [], interviewerGender = "female" } = interviewData || {};
  const navigate = useNavigate();

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isWebcamOn, setIsWebcamOn] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState(interviewerGender);

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const webcamVideoRef = useRef(null);
  const streamRef = useRef(null);

  const currentQuestion = questions[currentIndex] || {};
  const isLastQuestion = currentIndex === questions.length - 1;

  // ------------------------ LOAD VOICE (match selected gender) ------- //
  useEffect(() => {
    const loadVoice = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      if (!voices.length) return;

      if (voiceGender === "male") {
        const maleVoice = voices.find((v) =>
          [
            "ravi",
            "david",
            "mark",
            "male",
            "george",
            "guy",
            "microsoft david",
            "google uk english male",
          ].some((name) => v.name.toLowerCase().includes(name))
        );

        if (maleVoice) {
          setSelectedVoice(maleVoice);
          return;
        }
      } else {
        const femaleVoice = voices.find((v) =>
          [
            "heera",
            "kalpana",
            "zira",
            "samantha",
            "susan",
            "linda",
            "google uk english female",
            "google us english",
            "female",
          ].some((name) => v.name.toLowerCase().includes(name))
        );

        if (femaleVoice) {
          setSelectedVoice(femaleVoice);
          return;
        }
      }

      setSelectedVoice(voices[0]);
    };

    loadVoice();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoice;
    }
  }, [voiceGender]);

  const videoSource = voiceGender === "male" ? malevideo : femalevideo;

  // ------------------------ SPEAK FUNCTION ------- //
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !text) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        videoRef.current?.play().catch(() => {});
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        setTimeout(() => {
          resolve();
        }, 300);
      };

      utterance.onerror = () => {
        setIsAIPlaying(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  // Greet user by name first, THEN speak the question
  useEffect(() => {
    const greetAndAsk = async () => {
      if (isIntroPhase) {
        const greeting = `Hello ${
          userName || "there"
        }, welcome to your interview. Let's get started with the first question.`;
        await speakText(greeting);
        setIsIntroPhase(false);
      }

      if (currentQuestion.question) {
        await speakText(currentQuestion.question);
      }
    };

    greetAndAsk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, selectedVoice]);

  // Reset timer/answer whenever question changes
  useEffect(() => {
    setTimeLeft(currentQuestion.timeLimit || 60);
    setAnswer("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Countdown timer
  useEffect(() => {
    if (isAIPlaying || isSubmitting || isIntroPhase || isFinishing) return;
    if (timeLeft <= 0) {
      handleSubmitAnswer(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isAIPlaying, isSubmitting, isIntroPhase, isFinishing]);

  // ------------------------ WEBCAM CONTROL ------- //
  const toggleWebcam = async () => {
    if (isWebcamOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsWebcamOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        streamRef.current = stream;
        if (webcamVideoRef.current) {
          webcamVideoRef.current.srcObject = stream;
        }
        setIsWebcamOn(true);
      } catch (err) {
        console.error("Failed to access camera:", err);
        alert("Camera permission denied or camera not available.");
      }
    }
  };

  // Cleanup webcam and speech on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Bind webcam stream if ref becomes available
  useEffect(() => {
    if (isWebcamOn && webcamVideoRef.current && streamRef.current) {
      webcamVideoRef.current.srcObject = streamRef.current;
    }
  }, [isWebcamOn]);

  // ------------------------ MIC (Speech to Text) ------- //
  const toggleMic = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your answer.");
      return;
    }

    if (isMicOn) {
      recognitionRef.current?.stop();
      setIsMicOn(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setAnswer((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onerror = () => setIsMicOn(false);
    recognition.onend = () => setIsMicOn(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsMicOn(true);
  };

  // ------------------------ SUBMIT ANSWER ------- //
  const handleSubmitAnswer = async (autoSubmit = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (recognitionRef.current && isMicOn) {
      recognitionRef.current.stop();
      setIsMicOn(false);
    }

    const timeTaken = Math.max((currentQuestion.timeLimit || 60) - timeLeft, 0);

    try {
      await axios.post(
        `${ServerUrl}/api/interview/submit-answer`,
        {
          interviewId,
          questionId: currentQuestion._id,
          answer: answer || (autoSubmit ? "No answer provided within time limit." : ""),
          timeTaken,
        },
        { withCredentials: true }
      );

      if (isLastQuestion) {
        setIsFinishing(true);

        const result = await axios.post(
          `${ServerUrl}/api/interview/finish-interview`,
          { interviewId },
          { withCredentials: true }
        );

        const closingMessage = `Thank you, ${
          userName || "candidate"
        }. That completes your interview. Your results are being prepared, great job today.`;
        await speakText(closingMessage);

        onFinish({
          ...result.data,
          userName,
          interviewId,
        });
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Submit answer error:", error);
    } finally {
      setIsSubmitting(false);
      setIsFinishing(false);
    }
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit? Your progress will be saved in incomplete status.")) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-screen-xl min-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN — AI Avatar + Candidate Cam (35%) */}
        <div className="w-full lg:w-[36%] bg-gray-900 flex flex-col items-center justify-between p-6 border-r border-gray-800 text-white">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Session
            </span>

            <button
              onClick={handleExit}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer text-xs flex items-center gap-1"
            >
              <FaTimes size={13} /> Exit
            </button>
          </div>

          {/* AI AVATAR VIDEO */}
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-black relative border border-gray-800 aspect-[4/3]">
            <video
              ref={videoRef}
              src={videoSource}
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {/* AVATAR BADGE */}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-semibold text-white border border-white/10">
              AI Interviewer ({voiceGender === "female" ? "Sophia" : "David"})
            </div>

            {/* STATUS OVERLAY */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] text-emerald-300 font-semibold border border-white/10">
              {isIntroPhase
                ? "Greeting..."
                : isFinishing
                ? "Wrapping up..."
                : isAIPlaying
                ? "Speaking"
                : "Listening"}
            </div>
          </div>

          {/* CANDIDATE WEBCAM (PICTURE IN PICTURE / SPLIT) */}
          {isWebcamOn && (
            <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl bg-black relative mt-4 border border-emerald-500/40 aspect-[4/3]">
              <video
                ref={webcamVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />
              <div className="absolute bottom-2 left-3 bg-black/70 px-2.5 py-0.5 rounded-full text-[10px] text-white">
                Candidate: {userName || "You"}
              </div>
            </div>
          )}

          {/* CONTROLS UNDER VIDEO */}
          <div className="w-full mt-4 flex items-center justify-between gap-2 flex-wrap">
            <button
              onClick={toggleWebcam}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                isWebcamOn
                  ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                  : "bg-white/10 hover:bg-white/20 text-gray-300"
              }`}
            >
              {isWebcamOn ? <FaVideo size={13} /> : <FaVideoSlash size={13} />}
              {isWebcamOn ? "Cam On" : "Enable Cam"}
            </button>

            <button
              type="button"
              onClick={() => setVoiceGender((prev) => (prev === "female" ? "male" : "female"))}
              className="py-2 px-3 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-gray-300 transition cursor-pointer flex items-center gap-1"
              title="Switch AI Interviewer Avatar"
            >
              {voiceGender === "female" ? "👩 Sophia" : "👨 David"}
            </button>

            <button
              onClick={() => speakText(currentQuestion.question)}
              disabled={isAIPlaying || isIntroPhase || isFinishing}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center gap-1 transition cursor-pointer disabled:opacity-40"
              title="Repeat question"
            >
              <FaVolumeUp size={13} /> Replay
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN — Question + Answer (64%) */}
        <div className="w-full lg:w-[64%] flex flex-col p-6 sm:p-8 relative bg-white justify-between">
          <div>
            {/* PROGRESS & TIMER BAR */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                  Interview<span className="text-emerald-600">IQ</span>
                </h2>
                <p className="text-xs text-gray-400">Natural speech AI evaluation</p>
              </div>

              <div className="flex items-center gap-4 bg-emerald-50/70 px-4 py-2 rounded-2xl border border-emerald-100 shadow-xs">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">
                    Time Left
                  </span>
                  <Timer
                    timeLeft={timeLeft}
                    totalTime={currentQuestion.timeLimit || 60}
                  />
                </div>
                <div className="h-8 w-px bg-emerald-200"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">
                    Progress
                  </span>
                  <span className="text-lg font-black text-emerald-700">
                    {currentIndex + 1} / {questions.length || 5}
                  </span>
                </div>
              </div>
            </div>

            {/* CURRENT QUESTION DISPLAY */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-md uppercase">
                  Question {currentIndex + 1}
                </span>
                {currentQuestion.difficulty && (
                  <span className="text-[11px] font-semibold text-gray-400 capitalize">
                    • {currentQuestion.difficulty} Level
                  </span>
                )}
              </div>

              <div className="text-base sm:text-lg font-bold text-gray-900 leading-relaxed min-h-[56px]">
                {isIntroPhase
                  ? `Welcome, ${userName || "Candidate"}! Listen closely as your interviewer presents each question.`
                  : isFinishing
                  ? "Evaluating your answers and compiling performance scores..."
                  : currentQuestion.question || "Loading question..."}
              </div>
            </div>

            {/* ANSWER TEXTAREA */}
            <div className="relative">
              <textarea
                placeholder="Click the microphone below to speak, or type your answer directly..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={isAIPlaying || isSubmitting || isIntroPhase || isFinishing}
                className="w-full min-h-[170px] bg-gray-50 p-4 sm:p-5 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-gray-800 text-sm disabled:opacity-60"
              />

              {isMicOn && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-100 text-red-700 text-[11px] font-bold px-2.5 py-1 rounded-full animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  Listening...
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM CONTROLS (MIC + SUBMIT) */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-4">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={toggleMic}
              disabled={isAIPlaying || isSubmitting || isIntroPhase || isFinishing}
              className={`w-13 h-13 flex-shrink-0 flex items-center justify-center rounded-2xl shadow-md transition-colors cursor-pointer disabled:opacity-50 ${
                isMicOn
                  ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                  : "bg-gray-900 text-white hover:bg-black"
              }`}
              title={isMicOn ? "Turn Mic Off" : "Turn Mic On"}
            >
              {isMicOn ? <FaMicrophone size={19} /> : <FaMicrophoneSlash size={19} />}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSubmitAnswer(false)}
              disabled={
                isSubmitting ||
                isAIPlaying ||
                isIntroPhase ||
                isFinishing ||
                !answer.trim()
              }
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-3.5 rounded-2xl shadow-md transition-all font-bold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isFinishing
                ? "Finalizing Results..."
                : isSubmitting
                ? "Evaluating Answer..."
                : isLastQuestion
                ? "Submit & Finish Round"
                : "Submit Answer & Next"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;
