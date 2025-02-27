import express from "express";
import bcrypt from "bcrypt";
import Student from "../models/student/students.js";
import Instructor from "../models/courses/instructors.js";

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user in both student & instructor tables
        let user = await Student.findOne({ where: { email } }) ||
                   await Instructor.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare provided password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // If user requires password reset, redirect to reset page
        if (user.requiresPasswordReset) {
            return res.json({ redirect: "/reset-password", email });
        }

        // Successful login → redirect to dashboard (modify as needed)
        res.json({ redirect: "/dashboard" });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
