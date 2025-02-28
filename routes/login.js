import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { Student, Instructor } from "../models/index.js";
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Ensure it's set in your .env file

// Middleware to handle cookies
router.use(cookieParser());

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validate role input
        if (!role || !["Student", "Instructor"].includes(role)) {
            return res.status(400).json({ error: "Invalid role selection." });
        }

        // Identify which model to query based on role
        const model = role === "Student" ? Student : Instructor;

        // Find user in the appropriate table
        const user = await model.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Prepare token payload
        const tokenPayload = {
            email: user.email,
            role,
            requiresPasswordReset: user.requiresPasswordReset
        };

        // Attach studentID or instructorID based on role
        if (role === "Student") {
            tokenPayload.studentID = user.studentID;
        } else if (role === "Instructor") {
            tokenPayload.instructorID = user.instructorID;
        }

        // Sign the JWT token
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

        // Set HTTP-Only Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  // Secure only in production
            maxAge: 3600000 // 1 hour
        });

        // Redirect to password reset page if required
        if (user.requiresPasswordReset) {
            return res.json({ redirect: "/reset-password" });
        }

        // Redirect based on user role
        const dashboardRoute = role === "Student" ? "/student-dashboard" : "/instructor-dashboard";
        res.json({ redirect: dashboardRoute });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Logout Route
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

export default router;
