import express from "express";
import path from "path";
import dotenv from "dotenv";

import cookieParser from 'cookie-parser';

import { sequelize, Major, Minor, Student, Course, Instructor, Enrollment, Fee, Payment } from './models/index.js';  // This ensures models & associations are set before server starts

import loginRoutes from './routes/login.js';
import resetPasswordRoutes from './routes/reset-password.js';
import authRoutes from './routes/auth.js';
import authenticateToken from './middleware/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import paymentRoutes from './routes/payments.js';
import enrollmentRoutes from './routes/enrollments.js';



dotenv.config();
const app = express();

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));

// Middleware to parse JSON and form data
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: false })); // Parses form data
app.use(cookieParser()); // Handles cookies

// Static Files
app.use(express.static("public"));

//Routes
app.use('/auth', authRoutes);
app.use('/auth', loginRoutes);
app.use('/auth', resetPasswordRoutes);
app.use('/', dashboardRoutes);
app.use('/payments', paymentRoutes);
app.use('/enrollments', enrollmentRoutes);

// Render views for basic navigation
app.get('/', (req, res) => res.render('index'));
app.get('/activate', (req, res) => res.render('activate'));
app.get('/activation-success', (req, res) => res.render('activation-success')); 
app.get('/login', (req, res) => res.render('login')); //login portal for student and instructor
app.get('/reset-password', (req, res) => res.render('reset-password')); //reset password page for initial sign ups




// Student Dashboard


// Instructor Dashboard
app.get("/instructor-dashboard", authenticateToken, (req, res) => {
    if (req.user.role !== "Instructor") {
        return res.redirect("/login");
    }
    res.render("instructor-dashboard", { user: req.user });
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));
