import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/OpenRouter.services.js";
import User from "../models/user.model.js";
import Interview from "../models/interview.model.js";
import mongoose from "mongoose";

// Helper function to safely parse AI JSON responses
const safeJsonParse = (text) => {
  try {
    const cleaned = text.replace(/```json|```/gi, "").trim();
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error("Invalid JSON format from AI response");
  }
};

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }

    const filePath = req.file.path;
    const fileBuffer = await fs.promises.readFile(filePath);
    const uint8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
    let resumeText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";
    }

    resumeText = resumeText.replace(/\n/g, " ").trim();

    const messages = [
      {
        role: "system",
        content: `Extract structured data from the resume text and return ONLY valid JSON in this exact format, no extra text:
{
  "role": "string",
  "experience": "string",
  "project": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}`,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    const aiResponse = await askAi(messages);
    const parsed = safeJsonParse(aiResponse);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.json({
      role: parsed.role,
      experience: parsed.experience,
      project: parsed.project,
      skills: parsed.skills,
      resumeText,
    });
  } catch (error) {
    console.error("Error in analyzeResume:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: "Failed to analyze resume" });
  }
};

export const generateQuestion = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, project, skills } = req.body;

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {
      return res
        .status(400)
        .json({ message: "Role, Experience and Mode are Required." });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        message: "Not enough credits. Minimum 50 required.",
      });
    }

    const projectText =
      Array.isArray(project) && project.length ? project.join(", ") : "None";
    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(", ") : "None";
    const safeResume = resumeText?.trim() || "None";

    const userPrompt = `
Role: ${role}
Experience: ${experience}
Project: ${projectText}
Skills: ${skillsText}
Resume: ${safeResume}
Interview Mode: ${mode}
`;

    const messages = [
      {
        role: "system",
        content: `You are a real human interviewer conducting a professional interview.
Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 -> easy
Question 2 -> easy
Question 3 -> medium
Question 4 -> medium
Question 5 -> hard

Make questions based on the candidate's role, experience, projects, skills, and resume details.`,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const aiResponse = await askAi(messages);

    if (!aiResponse || !aiResponse.trim()) {
      return res.status(500).json({
        message: "AI returned empty response",
      });
    }

    const questionsList = aiResponse
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
      .slice(0, 5);

    if (questionsList.length === 0) {
      return res.status(500).json({
        message: "AI failed to generate valid questions",
      });
    }

    user.credits -= 50;
    await user.save();

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: questionsList.map((q, index) => ({
        question: q,
        difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
        timeLimit: [60, 60, 90, 90, 120][index],
      })),
    });

    return res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });
  } catch (error) {
    console.error("Error in generateQuestion:", error);
    return res
      .status(500)
      .json({ message: `Failed to create Interview: ${error.message}` });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionId, answer, timeTaken } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const question = interview.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (!answer || !answer.trim()) {
      question.score = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";
      await interview.save();
      return res.json({ feedback: question.feedback });
    }

    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not evaluated.";
      question.answer = answer;
      await interview.save();
      return res.json({ feedback: question.feedback });
    }

    const messages = [
      {
        role: "system",
        content: `You are a professional human interviewer evaluating a candidate's answer in a real interview.
Evaluate naturally and fairly.

Score the answer in these areas (0 to 100):
1. Confidence: Does the answer sound clear, confident, and well-presented?
2. Communication: Is the language simple, clear, and easy to understand?
3. Correctness: Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased. Do not give random high scores.
- Calculate finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).
- Feedback Rules: Write 10 to 15 words of natural human feedback. Do NOT repeat the question or explain scoring.

Return ONLY valid JSON in this format:
{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}`,
      },
      {
        role: "user",
        content: `Question: ${question.question}\nAnswer: ${answer}`,
      },
    ];

    const aiResponse = await askAi(messages);
    const parsed = safeJsonParse(aiResponse);

    question.answer = answer;
    question.score = parsed.finalScore;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.feedback = parsed.feedback;

    await interview.save();

    return res.status(200).json({ feedback: parsed.feedback });
  } catch (error) {
    console.error("Error in submitAnswer:", error);
    return res
      .status(500)
      .json({ message: `Failed to submit answer: ${error.message}` });
  }
};

export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Failed to find interview" });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;
    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.finalScore = Number(finalScore.toFixed(1));
    interview.status = "Completed";

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
        feedback: q.feedback || "",
      })),
    });
  } catch (error) {
    console.error("Error in finishInterview:", error);
    return res
      .status(500)
      .json({ message: `Failed to finish Interview: ${error.message}` });
  }
};

export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("role experience mode finalScore status createdAt");

    return res.status(200).json(interviews);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to fetch interviews: ${error}` });
  }
};

export const getInterviewReport = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;
    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    return res.json({
      _id: interview._id,
      role: interview.role,
      experience: interview.experience,
      mode: interview.mode,
      createdAt: interview.createdAt,
      status: interview.status,
      finalScore: interview.finalScore,
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
        feedback: q.feedback || "",
      })),
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: `Failed to find currentUser Interview report: ${error.message || error}`,
      });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId }).sort({ createdAt: 1 });

    const total = interviews.length;
    const completed = interviews.filter((i) => i.status === "Completed");

    if (completed.length === 0) {
      return res.status(200).json({
        totalInterviews: total,
        completedInterviews: 0,
        avgScore: 0,
        avgConfidence: 0,
        avgCommunication: 0,
        avgCorrectness: 0,
        chartData: [],
        modeBreakdown: { Technical: 0, HR: 0 },
        recentInterviews: [],
      });
    }

    let sumFinalScore = 0;
    let sumConfidence = 0;
    let sumCommunication = 0;
    let sumCorrectness = 0;
    let countQuestions = 0;

    const chartData = [];
    const modeBreakdown = { Technical: 0, HR: 0 };

    completed.forEach((item) => {
      sumFinalScore += item.finalScore || 0;
      if (item.mode === "HR") modeBreakdown.HR++;
      else modeBreakdown.Technical++;

      let qConf = 0, qComm = 0, qCorr = 0;
      item.questions.forEach((q) => {
        qConf += q.confidence || 0;
        qComm += q.communication || 0;
        qCorr += q.correctness || 0;
        countQuestions++;
      });
      sumConfidence += qConf;
      sumCommunication += qComm;
      sumCorrectness += qCorr;

      const qLen = item.questions.length || 1;
      chartData.push({
        date: new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        score: item.finalScore || 0,
        confidence: Number((qConf / qLen).toFixed(1)),
        communication: Number((qComm / qLen).toFixed(1)),
        correctness: Number((qCorr / qLen).toFixed(1)),
        role: item.role,
        mode: item.mode,
      });
    });

    const avgScore = Number((sumFinalScore / completed.length).toFixed(1));
    const avgConfidence = countQuestions ? Number((sumConfidence / countQuestions).toFixed(1)) : 0;
    const avgCommunication = countQuestions ? Number((sumCommunication / countQuestions).toFixed(1)) : 0;
    const avgCorrectness = countQuestions ? Number((sumCorrectness / countQuestions).toFixed(1)) : 0;

    const recentInterviews = interviews
      .slice(-5)
      .reverse()
      .map((i) => ({
        _id: i._id,
        role: i.role,
        mode: i.mode,
        experience: i.experience,
        finalScore: i.finalScore,
        status: i.status,
        createdAt: i.createdAt,
      }));

    return res.status(200).json({
      totalInterviews: total,
      completedInterviews: completed.length,
      avgScore,
      avgConfidence,
      avgCommunication,
      avgCorrectness,
      chartData,
      modeBreakdown,
      recentInterviews,
    });
  } catch (error) {
    return res.status(500).json({ message: `Analytics error: ${error.message}` });
  }
};

export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Interview.findOneAndDelete({ _id: id, userId: req.userId });
    if (!deleted) {
      return res.status(404).json({ message: "Interview not found or unauthorized" });
    }
    return res.status(200).json({ message: "Interview deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Delete error: ${error.message}` });
  }
};
