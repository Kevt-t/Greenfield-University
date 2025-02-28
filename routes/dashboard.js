import express from "express";
import authenticateToken from "../middleware/auth.js";
import { Student, Instructor, Enrollment, Course, Fee } from "../models/index.js";

const router = express.Router();

// Student Dashboard (No Changes Here - Your Existing Code Works)
router.get("/student-dashboard", authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "Student") {
            return res.redirect("/login");
        }

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
                    required: false
                }
            ],
        });

        if (!student) {
            return res.status(404).send("User not found.");
        }

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

        const totalFees = student.fees.reduce((sum, fee) => sum + fee.amount, 0);

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

// ✅ Instructor Dashboard (Fixed Version)
router.get("/instructor-dashboard", authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "Instructor") {
            return res.redirect("/login");
        }

        const instructor = await Instructor.findOne({
            where: { instructorID: req.user.instructorID },
            include: [
                {
                    model: Course,
                    as: "courses",
                    include: [
                        {
                            model: Enrollment,
                            as: "enrollments",
                            include: [
                                {
                                    model: Student,
                                    as: "student",
                                    attributes: ["studentID", "firstName", "lastName", "email"]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!instructor) {
            return res.status(404).send("Instructor not found.");
        }

        const courses = instructor.courses.map(course => ({
            id: course.courseID,
            name: course.courseName,
            enrollments: course.enrollments.map(enroll => ({
                studentName: `${enroll.student.firstName} ${enroll.student.lastName}`,
                studentEmail: enroll.student.email,
                studentID: enroll.student.studentID // 🔥 Ensure this exists
            }))
        }));
        
        res.render("instructor-dashboard", {
            user: instructor,
            courses
        });

    } catch (error) {
        console.error("Error loading instructor dashboard:", error);
        res.status(500).send("Internal server error.");
    }
});

export default router;
