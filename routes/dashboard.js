import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student Dashboard (Protected)
router.get("/student-dashboard", authenticateUser, (req, res) => {
  if (req.user.role !== "Student") {
    return res.redirect("/login");
  }
  res.render("student-dashboard", { email: req.user.email });
});

// Instructor Dashboard (Protected)
router.get("/instructor-dashboard", authenticateUser, (req, res) => {
  if (req.user.role !== "Instructor") {
    return res.redirect("/login");
  }
  res.render("instructor-dashboard", { email: req.user.email });
});

export default router;
