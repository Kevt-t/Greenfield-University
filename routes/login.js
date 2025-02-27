import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import Student from "../models/student/students.js";
import Instructor from "../models/courses/instructors.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Ensure to set this in your .env file

// Middleware to use cookies
router.use(cookieParser());

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

        // Generate JWT Token
        const token = jwt.sign(
            { email: user.email, id: user.id, requiresPasswordReset: user.requiresPasswordReset },
            JWT_SECRET,
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        // Set the token in HTTP-Only Cookie (More Secure)
        res.cookie("token", token, {
            httpOnly: true, // Prevent JavaScript access (Mitigates XSS attacks)
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            maxAge: 3600000 // 1 hour
        });

        // If user requires password reset, redirect to reset-password page
        if (user.requiresPasswordReset) {
            return res.json({ redirect: "/reset-password" });
        }

        // Successful login → redirect to dashboard
        res.json({ redirect: "/dashboard" });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Logout Route - Clears JWT Cookie
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

export default router;
