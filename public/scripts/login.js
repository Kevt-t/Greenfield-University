import express from 'express';
import bcrypt from 'bcrypt';
import { Student, Instructor } from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { role, email, password } = req.body;

    if (!role || !email || !password) {
        return res.status(400).send("All fields are required.");
    }

    let userModel;
    switch (role.toLowerCase()) {
        case 'student': userModel = Student; break;
        case 'instructor': userModel = Instructor; break;
        default: return res.status(400).send("Invalid role selected.");
    }

    try {
        // Find user by email
        const user = await userModel.findOne({ where: { email } });

        if (!user) {
            return res.status(401).send("Invalid email or password.");
        }

        // ✅ Check if the password matches (Compare hashed password)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid email or password.");
        }

        // ✅ Check if account is active
        if (!user.isAccountActive) {
            return res.status(403).send("Account not activated. Please check your email.");
        }

        // ✅ Store User Info in Session
        req.session.user = { id: user.id, role };

        // ✅ Redirect user to their respective dashboard
        res.redirect(`/${role.toLowerCase()}-dashboard`);

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send("Server error. Please try again.");
    }
});

export default router;
