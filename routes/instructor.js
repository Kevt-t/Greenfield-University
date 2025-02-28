import express from "express";
import authenticateToken from "../middleware/auth.js";
import { Course, Enrollment, Student } from "../models/index.js";

const router = express.Router();

// Create Course
router.post("/courses", authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "Instructor") {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const { courseName, description, credits, schedule } = req.body;

        const newCourse = await Course.create({
            courseName,
            description,
            credits,
            schedule,
            instructorID: req.user.instructorID
        });

        res.json({ message: "Course created successfully!", course: newCourse });
    } catch (error) {
        console.error("Create Course Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update Course
router.patch("/courses/:id", authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "Instructor") {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const course = await Course.findOne({
            where: { courseID: req.params.id, instructorID: req.user.instructorID }
        });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const { courseName, description, credits, schedule } = req.body;

        await course.update({ courseName, description, credits, schedule });

        res.json({ message: "Course updated successfully!", course });
    } catch (error) {
        console.error("Update Course Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete Course
router.delete("/courses/:id", authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "Instructor") {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const course = await Course.findOne({
            where: { courseID: req.params.id, instructorID: req.user.instructorID }
        });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        await course.destroy();

        res.json({ message: "Course deleted successfully!" });
    } catch (error) {
        console.error("Delete Course Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update Student Grade
router.patch("/courses/:courseID/students/:studentID/grade", authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "Instructor") {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const { grade } = req.body;

        const enrollment = await Enrollment.findOne({
            where: {
                studentID: req.params.studentID,
                courseID: req.params.courseID
            }
        });

        if (!enrollment) {
            return res.status(404).json({ error: "Enrollment not found" });
        }

        await enrollment.update({ grade });

        res.json({ message: "Grade updated successfully!" });
    } catch (error) {
        console.error("Update Grade Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Enroll Student into Course
router.post("/courses/:courseID/enroll-student", authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "Instructor") {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const { email } = req.body;
        const { courseID } = req.params;

        const student = await Student.findOne({ where: { email } });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        const existingEnrollment = await Enrollment.findOne({
            where: { studentID: student.studentID, courseID }
        });

        if (existingEnrollment) {
            return res.status(400).json({ error: "Student is already enrolled in this course." });
        }

        await Enrollment.create({
            studentID: student.studentID,
            courseID,
            status: 'Enrolled'
        });

        res.json({ message: "Student successfully enrolled!" });

    } catch (error) {
        console.error("Enroll Student Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


export default router;
