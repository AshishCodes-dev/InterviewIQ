import User from "../models/user.model.js";


export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `failed to get CurrentUser: ${error}` })
    }
}

export const addCredits = async (req, res) => {
    try {
        const userId = req.userId;
        const { amount = 100 } = req.body;

        const creditAmount = Number(amount);
        if (isNaN(creditAmount) || creditAmount <= 0) {
            return res.status(400).json({ message: "Invalid credit amount" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.credits = (user.credits || 0) + creditAmount;
        await user.save();

        return res.status(200).json({
            message: `Successfully added ${creditAmount} credits!`,
            credits: user.credits,
            user,
        });
    } catch (error) {
        return res.status(500).json({ message: `Failed to add credits: ${error.message}` });
    }
};