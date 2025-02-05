import express from "express";
import crypto from "crypto"; // For generating activation tokens
import bcrypt from "bcrypt"; // For hashing temp password
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Student from "../models/student/students.js";
import Instructor from "../models/courses/instructors.js";

dotenv.config();

const router = express.Router();

// ✅ Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use another provider
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// ✅ Handle Activation Request (Sends Email)
router.post("/activate", async (req, res) => {
  try {
    const { role, name, userID, email } = req.body;

    // 1️⃣ Check if user exists in DB based on role
    let user;
    if (role === "Student") {
      user = await Student.findOne({ where: { email } });
    } else if (role === "Instructor") {
      user = await Instructor.findOne({ where: { email } });
    } else {
      return res.status(400).json({ error: "Invalid role selection." });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // 2️⃣ Generate Activation Token
    const activationToken = crypto.randomBytes(32).toString("hex");

    // 3️⃣ Generate a Temporary Password & Hash It
    const tempPassword = crypto.randomBytes(5).toString("hex"); // Random temp password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 4️⃣ Update User Record with Activation Token & Temp Password
    await user.update({
      activationToken,
      password: hashedPassword, // Store hashed temp password
    });

    // 5️⃣ Send Email with Activation Link
    const activationLink = `http://localhost:3000/auth/activate/${activationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Activate Your Account - Greenfield University",
      html: `
        <h3>Hello ${name},</h3>
        <p>Click the link below to activate your account:</p>
        <a href="${activationLink}">${activationLink}</a>
        <p>Your temporary password is: <strong>${tempPassword}</strong></p>
        <p>Please log in and reset your password after activation.</p>
        <br>
        <p>Best Regards,</p>
        <p>Greenfield University</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Activation email sent successfully!" });

  } catch (error) {
    console.error("Activation error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Handle Account Activation (When User Clicks Link)
router.get("/activate/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // 1️⃣ Find User by Activation Token
    const user = await Student.findOne({ where: { activationToken: token } }) ||
                 await Instructor.findOne({ where: { activationToken: token } });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired activation link." });
    }

    // 2️⃣ Activate Account
    await user.update({
      isAccountActive: true,
      activationToken: null, // Remove token after activation
    });

    // 3️⃣ Redirect to Login Page
    res.redirect("/login");

  } catch (error) {
    console.error("Activation error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
