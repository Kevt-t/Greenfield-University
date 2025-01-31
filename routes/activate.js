import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { Student, Instructor, Admin } from '../models/index.js'; 

const router = express.Router();

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Set your email in .env
        pass: process.env.EMAIL_PASS
    }
});

// Generate a temporary password
const generateTempPassword = () => {
    return Math.random().toString(36).slice(-8);
};

// Activation Route
router.post('/', async (req, res) => {
    const { role, name, id, email } = req.body;

    if (!role || !name || !id || !email) {
        return res.status(400).send("All fields are required.");
    }

    let userModel;
    switch (role) {
        case 'student': userModel = Student; break;
        case 'instructor': userModel = Instructor; break;
        case 'admin': userModel = Admin; break;
        default: return res.status(400).send("Invalid role selected.");
    }

    try {
        // Check if email is already registered
        const existingUser = await userModel.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send("Email already registered.");
        }

        // Generate token and temporary password
        const activationToken = crypto.randomBytes(20).toString('hex');
        const tempPassword = generateTempPassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Create new user (inactive)
        const newUser = await userModel.create({
            [`${role}ID`]: id, // Maps correctly (studentID, instructorID, adminID)
            firstName: name.split(' ')[0],
            lastName: name.split(' ')[1] || '',
            email,
            password: hashedPassword,
            isAccountActive: false,
            activationToken
        });

        // Send activation email
        const activationLink = `http://localhost:3000/activate/${activationToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Activate Your Greenfield University Account",
            html: `
                <h2>Welcome to Greenfield University!</h2>
                <p>Click the link below to activate your account:</p>
                <a href="${activationLink}">Activate My Account</a>
                <p>Your temporary password: <strong>${tempPassword}</strong></p>
                <p>Please log in and change your password immediately.</p>
            `
        });

        res.send("Activation email sent! Check your inbox.");
    } catch (error) {
        console.error("Activation Error:", error);
        res.status(500).send("Server error. Please try again.");
    }
});

export default router;
