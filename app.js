import express from "express";
import path from "path";
import dotenv from "dotenv";

import cookieParser from 'cookie-parser';

import { sequelize, Major, Minor, Student, Course, Instructor, Enrollment, Fee, Payment } from './models/index.js';  // This ensures models & associations are set before server starts

import loginRoutes from './routes/login.js';
import resetPasswordRoutes from './routes/reset-password.js';
import authRoutes from './routes/auth.js';
import authenticateToken from './middleware/auth.js';



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


// Render views for basic navigation
app.get('/', (req, res) => res.render('index'));
app.get('/activate', (req, res) => res.render('activate'));
app.get('/activation-success', (req, res) => res.render('activation-success')); 
app.get('/login', (req, res) => res.render('login')); //login portal for student and instructor
app.get('/reset-password', (req, res) => res.render('reset-password')); //reset password page for initial sign ups




// Student Dashboard
app.get("/student-dashboard", authenticateToken, async (req, res) => {
    try {
        console.log("Decoded User from Token:", req.user);

        if (req.user.role !== "Student") {
            return res.redirect("/login");
        }

        // Fetch student with their enrollments and associated courses
        const student = await Student.findOne({
            where: { studentID: req.user.studentID },
            include: [
                {
                    model: Enrollment,
                    as: "enrollments",
                    include: [
                        {
                            model: Course,
                            as: "course",
                            attributes: ["courseID", "courseName", "credits"],
                        },
                    ],
                    attributes: ["grade"], // Fetch grade for GPA calculation
                },
            ],
        });

        if (!student) {
            return res.status(404).send("User not found.");
        }

        // Extract enrollments and calculate GPA
        const enrollments = student.enrollments;

        // Filter out courses with no grade assigned
        const gradedEnrollments = enrollments.filter(e => e.grade !== null);

        let totalCredits = 0;
        let totalWeightedPoints = 0;

        gradedEnrollments.forEach(enrollment => {
            const { grade, course } = enrollment;
            const credits = course.credits;

            totalCredits += credits;
            totalWeightedPoints += grade * credits; // Weighted sum of grade points
        });

        // Calculate GPA
        const gpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : "N/A";

        // Pass student data, courses, and GPA to the view
        res.render("student-dashboard", { 
            user: student, 
            courses: enrollments.map(e => e.course), 
            gpa 
        });

    } catch (error) {
        console.error("Error loading student dashboard:", error);
        res.status(500).send("Internal server error.");
    }
});

  

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
