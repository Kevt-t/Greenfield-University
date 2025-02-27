import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Student from "../models/student/students.js";
import Instructor from "../models/courses/instructors.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

router.post("/reset-password", async (req, res) => {
    try {
        // Get Token from Cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).json({ error: "Unauthorized request. Please log in again." });
        }

        // Verify Token
        const decoded = jwt.verify(token, JWT_SECRET);
        const { email, id } = decoded;

        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ error: "Missing new password." });
        }

        // Find User
        let user = await Student.findOne({ where: { email } }) ||
                   await Instructor.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Hash New Password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await user.update({
            password: hashedPassword,
            requiresPasswordReset: false
        });

        res.json({ message: "Password updated successfully! Please log in again." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
