import express from "express";
import authenticateToken from "../middleware/auth.js";
import Enrollment from "../models/courses/enrollments.js";

const router = express.Router();

// Handle Course Drop
router.post("/drop-course", authenticateToken, async (req, res) => {
    try {
        const { courseID } = req.body;
        const studentID = req.user.studentID;

        if (!courseID) {
            return res.status(400).json({ error: "Course ID is required." });
        }

        // Find the enrollment record
        const enrollment = await Enrollment.findOne({ 
            where: { courseID, studentID, status: "Enrolled" } 
        });

        if (!enrollment) {
            return res.status(404).json({ error: "Enrollment not found or already dropped." });
        }

        // Update enrollment status
        await enrollment.update({ status: "Dropped" });

        res.json({ message: "Course dropped successfully!" });

    } catch (error) {
        console.error("Drop Course Error:", error);
        res.status(500).json({ error: "Failed to drop course. Try again later." });
    }
});

export default router;
