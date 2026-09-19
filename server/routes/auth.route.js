import express from "express";
import { googleAuth, logOut, demoAuth } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/google", googleAuth);
authRouter.post("/demo", demoAuth);
authRouter.get("/logout", logOut);

export default authRouter;