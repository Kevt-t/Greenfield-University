import Student from './models/student/students.js'; // Ensure correct model path
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const testQuery = async () => {
    try {
        const testId = 1; // Replace with an actual ID from your database
        const student = await Student.findOne({ where: { studentID: testId } });

        if (student) {
            console.log("✅ Student found:", student.toJSON());
        } else {
            console.log("❌ No student found with ID:", testId);
        }
    } catch (error) {
        console.error("❌ Error querying student:", error);
    }
};

testQuery();
