import User from "../models/user.model.js";
import genToken from "../config/token.js";

export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email });
        }

        let token = await genToken(user._id);
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Google auth error: ${error}` });
    }
};

export const logOut = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        res.clearCookie("token", {
            path: "/",
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Logout error: ${error}` });
    }
};

export const demoAuth = async (req, res) => {
    try {
        const demoEmail = "demo.candidate@interviewiq.ai";
        let user = await User.findOne({ email: demoEmail });

        if (!user) {
            user = await User.create({
                name: "Demo Candidate",
                email: demoEmail,
                credits: 200,
            });
        } else if (user.credits < 50) {
            user.credits = 200;
            await user.save();
        }

        let token = await genToken(user._id);
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Demo auth error: ${error.message}` });
    }
};