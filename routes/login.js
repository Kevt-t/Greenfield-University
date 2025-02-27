import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Student from "../models/student/students.js";
import Instructor from "../models/courses/instructors.js";

dotenv.config();

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET; // Ensure this is set in your .env file

// Handle Login Request
router.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);

  const { email, password, role } = req.body;

  if (!email || !password || !role) {
      console.log("Missing fields:", { email, password, role });
      return res.status(400).json({ error: "All fields are required" });
  }

  res.json({ message: "Fields received correctly", data: req.body });
});


// Handle Password Reset
router.post("/reset-password", async (req, res) => {
  try {
    const { newPassword, role, resetToken } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    // Verify the reset token
    const decoded = jwt.verify(resetToken, jwtSecret);
    const email = decoded.email;

    let user;
    if (role === "Student") {
      user = await Student.findOne({ where: { email } });
    } else if (role === "Instructor") {
      user = await Instructor.findOne({ where: { email } });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash new password and update user record
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      password: hashedPassword,
      requiresPasswordReset: false,
    });

    res.json({ message: "Password successfully reset. Please log in." });

  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
