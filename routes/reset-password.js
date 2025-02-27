import express from "express";
import bcrypt from "bcrypt";
import Student from "../models/student/students.js";
import Instructor from "../models/courses/instructors.js";

const router = express.Router();

router.post("/reset-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        console.log("DEBUG: Received Email ->", email);
        console.log("DEBUG: Received New Password ->", newPassword);

        if (!email || !newPassword) {
            return res.status(400).json({ error: "Missing email or password." });
        }

        let user = await Student.findOne({ where: { email } }) ||
                   await Instructor.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

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
