import express from "express";
import authenticateToken from "../middleware/auth.js";
import Student from "../models/student/students.js";
import Enrollment from "../models/courses/enrollments.js";
import Course from "../models/courses/courses.js";
import Fee from "../models/finance/fees.js";

const router = express.Router();

router.get("/student-dashboard", authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "Student") {
            return res.redirect("/login");
        }

        // Fetch student details with enrollments
        const student = await Student.findOne({
            where: { studentID: req.user.studentID },
            include: [
                {
                    model: Enrollment,
                    as: "enrollments",
                    include: [{ model: Course, as: "course", attributes: ["courseID", "courseName", "credits"] }],
                    attributes: ["grade"]
                },
                {
                    model: Fee,
                    as: "fees",
                    where: { status: "Pending" },
                    required: false // Allows student without fees
                }
            ],
        });

        if (!student) {
            return res.status(404).send("User not found.");
        }

        // Calculate GPA
        const enrollments = student.enrollments;
        const gradedEnrollments = enrollments.filter(e => e.grade !== null);
        let totalCredits = 0;
        let totalWeightedPoints = 0;
        gradedEnrollments.forEach(enrollment => {
            const { grade, course } = enrollment;
            const credits = course.credits;
            totalCredits += credits;
            totalWeightedPoints += grade * credits;
        });
        const gpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : "N/A";

        // Calculate Total Outstanding Fees
        const totalFees = student.fees.reduce((sum, fee) => sum + fee.amount, 0);

        // Pass Data to the Dashboard
        res.render("student-dashboard", {
            user: student,
            courses: enrollments.map(e => e.course),
            gpa,
            totalFees,
            fees: student.fees
        });

    } catch (error) {
        console.error("Error loading student dashboard:", error);
        res.status(500).send("Internal server error.");
    }
});

export default router;
