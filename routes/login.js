import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import Student from "../models/student/students.js";
import Instructor from "../models/courses/instructors.js";
import dotenv from 'dotenv';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Store in .env

// Middleware to use cookies
router.use(cookieParser());

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Ensure role is provided and valid
        if (!role || !["Student", "Instructor"].includes(role)) {
            return res.status(400).json({ error: "Invalid role selection." });
        }

        // Determine which table to check based on role
        let user;
        if (role === "Student") {
            user = await Student.findOne({ where: { email } });
        } else if (role === "Instructor") {
            user = await Instructor.findOne({ where: { email } });
        }

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare provided password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { 
                email: user.email, 
                studentID: user.studentID,  // Store studentID instead of id
                role, 
                requiresPasswordReset: user.requiresPasswordReset
            },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
        
        // Set the token in HTTP-Only Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000 // 1 hour
        });

        // If user requires password reset, redirect to reset-password
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
