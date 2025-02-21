import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import Student from "../models/student/students.js";
import Instructor from "../models/courses/instructors.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Render Reset Password Page (Only for Authenticated Users)
router.get("/reset-password", authenticateUser, (req, res) => {
    res.render("reset-password", { email: req.user.email });
});

// Handle Reset Password Submission
router.post("/reset-password", authenticateUser, async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long." });
        }

        let user = await Student.findOne({ where: { email: req.user.email } }) ||
                   await Instructor.findOne({ where: { email: req.user.email } });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password and mark reset as complete
        await user.update({
            password: hashedPassword,
            requiresPasswordReset: false, // ✅ Now they can log in normally
        });

        res.json({ redirect: "/login", message: "Password updated successfully. Please log in." });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
