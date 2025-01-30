import express from "express";
import Student from "../models/student/students.js";
import bcrypt from "bcrypt";
import session from "express-session";

const router = express.Router();

// Initialize session
router.use(session({
    secret: process.env.SESSION_SECRET || "your_secret_key", // Use ENV variable for security
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }, // One-day expiry
  }));
  

// 📌 Login Route
router.post("/", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const student = await Student.findOne({ where: { email } });
  
      if (!student) return res.render("login", { errorMessage: "No student found with this email." });
  
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) return res.render("login", { errorMessage: "Incorrect password." });
  
      req.session.studentID = student.studentID;
      if (student.isTemporaryPassword) return res.redirect("/reset-password");
  
      res.redirect("/studentDashboard"); // Redirect to dashboard after login
    } catch (error) {
      console.error(error);
      res.render("login", { errorMessage: "Login failed. Try again later." });
    }
  });
  

export default router;
