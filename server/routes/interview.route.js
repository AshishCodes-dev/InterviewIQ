import express from "express";
import isAuth from "../middlewares/isAuth.js";  
import upload from "../middlewares/multer.js";
import { 
  analyzeResume, 
  getInterviewReport, 
  getMyInterviews, 
  generateQuestion, 
  submitAnswer, 
  finishInterview,
  getAnalytics,
  deleteInterview
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.post("/resume", isAuth, upload.single("resume"), analyzeResume);
interviewRouter.post("/generate-question", isAuth, generateQuestion);
interviewRouter.post("/submit-answer", isAuth, submitAnswer);
interviewRouter.post("/finish-interview", isAuth, finishInterview);

interviewRouter.get("/get-interviews", isAuth, getMyInterviews);
interviewRouter.get("/analytics", isAuth, getAnalytics);
interviewRouter.get("/report/:id", isAuth, getInterviewReport);
interviewRouter.delete("/:id", isAuth, deleteInterview);

export default interviewRouter;