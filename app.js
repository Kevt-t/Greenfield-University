import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/auth.js"; // Middleware to verify JWT

import './models/index.js';  // This ensures models & associations are set before server starts
import setupAssociations from './models/associations.js';

import loginRoutes from "./routes/login.js";
import resetPasswordRoutes from "./routes/reset-password.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Routes
app.use("/auth", authRoutes);
app.use("/auth", loginRoutes);
app.use("/auth", resetPasswordRoutes);

// Render views
app.get("/", (req, res) => res.render("index"));
app.get("/activate", (req, res) => res.render("activate"));
app.get("/activation-success", (req, res) => res.render("activation-success"));
app.get("/login", (req, res) => res.render("login"));
app.get("/reset-password", (req, res) => res.render("reset-password"));

// Student Dashboard (Protected Route)
app.get("/student-dashboard", verifyToken, (req, res) => {
    if (req.user.role !== "Student") {
        return res.status(403).send("Access denied.");
    }
    res.render("student-dashboard", { user: req.user });
});

// Instructor Dashboard (Protected Route)
app.get("/instructor-dashboard", verifyToken, (req, res) => {
    if (req.user.role !== "Instructor") {
        return res.status(403).send("Access denied.");
    }
    res.render("instructor-dashboard", { user: req.user });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
