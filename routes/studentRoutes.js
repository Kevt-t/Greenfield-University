import express from 'express';
import { Student, Course, Enrollment, Fee, Payment } from '../models/index.js';

const router = express.Router();

router.get('/dashboard/:id', async (req, res) => {
    try {
        const studentID = req.params.id;

        // Get Student Info
        const student = await Student.findByPk(studentID);

        if (!student) {
            return res.status(404).send("Student not found");
        }

        // Get Enrolled Courses
        const enrollments = await Enrollment.findAll({
            where: { studentID },
            include: { model: Course, as: 'course' }
        });

        const courses = enrollments.map(enrollment => enrollment.course);

        // Get Student Fees
        const fees = await Fee.findAll({
            where: { studentID }
        });

        // Get Student Payments
        const payments = await Payment.findAll({
            where: { studentID }
        });

        res.render('studentDashboard', { student, courses, fees, payments });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

export default router;
