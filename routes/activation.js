import express from "express";
import Student from "../models/student/students.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// 📌 Send Activation Email
router.post("/send", async (req, res) => {
  const { email } = req.body;

  try {
    const student = await Student.findOne({ where: { email } });

    if (!student) {
      return res.status(400).send("No student found with this email.");
    }

    if (student.isAccountActive) {
      return res.send("Your account is already activated.");
    }

    // Generate Token
    const token = crypto.randomBytes(32).toString("hex");
    student.activationToken = token;
    await student.save();

    // Email Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const activationLink = `http://localhost:3000/activate/${token}`;

    // Email Options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: "Activate Your Greenfield University Account",
      html: `<h3>Click the link below to activate your account:</h3>
      <a href="${activationLink}">Activate Account</a>
      <p>This link expires in 24 hours.</p>`,
    };

    // Send Email with Debugging
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).send("Error sending activation email.");
      }
      console.log("Email sent:", info.response);
      res.send("Activation email sent. Check your inbox.");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending activation email.");
  }
});

// 📌 Activate Account
router.get("/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const student = await Student.findOne({ where: { activationToken: token } });

    if (!student) {
      return res.status(400).send("Invalid or expired activation link.");
    }

    student.isAccountActive = true;
    student.activationToken = null; // Remove token after activation
    await student.save();

    res.render("activated", { name: student.firstName });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error activating account.");
  }
});

export default router;
