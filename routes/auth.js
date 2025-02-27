import express from "express";
import crypto from "crypto"; // For generating activation tokens
import bcrypt from "bcrypt"; // For hashing temp password
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Student from "../models/student/students.js"; 
import Instructor from "../models/courses/instructors.js";

dotenv.config();

const router = express.Router();

// Setup Nodemailer Transporter 
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use another provider
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// Handle Activation Request (Sends Email)
router.post("/activate", async (req, res) => {
  try {
    const { role, name, userID, email } = req.body; // we need these for basic verification

    // Ensure all required fields are provided
    if (!role || !name || !userID || !email) {
      return res.status(400).json({ error: "All fields are required." });
    }

    let user; 
    
    // Dynamically adjust userID field
    const searchCriteria = {
      email,
      ...(role === "Student" ? { studentID: userID } : {}),
      ...(role === "Instructor" ? { instructorID: userID } : {}),
    };

    // Find User based on Role
    user = role === "Student" 
      ? await Student.findOne({ where: searchCriteria }) 
      : await Instructor.findOne({ where: searchCriteria });

    // Validate if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found! Please check your details." });
    }

    // Validate Name (Check First & Last Name)
    const fullName = `${user.firstName} ${user.lastName}`;
    if (fullName.toLowerCase() !== name.toLowerCase()) {
      return res.status(400).json({ error: "Name does not match our records." });
    }

    // Generate Activation Token
    const activationToken = crypto.randomBytes(32).toString("hex"); // dish out for user, need to pass this down to database

    // Generate a Temporary Password & Hash It
    const tempPassword = crypto.randomBytes(5).toString("hex"); // half of the equation, need to pass this down to hash it
    const hashedPassword = await bcrypt.hash(tempPassword, 10); // bet now its hashed, just need to assign it to the user and pass to DB

    // Update User Record with Activation Token & Temp Password
    console.log("Updating user:", user); //confirmation

    await user.update({
      activationToken,  //pass the earlier activationToken
      password: hashedPassword, //pass the earlier hashedPassword
    });
    
    console.log("User updated successfully"); //confirm

    // 7️. Send Email with Activation Link
    const activationLink = `http://localhost:3000/auth/activate/${activationToken}`; // plug in the activationToken
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Activate Your Account - Greenfield University",
      html: `
        <h3>Hello ${name},</h3>
        <p>Click the link below to activate your account:</p>
        <a href="${activationLink}">${activationLink}</a> 
        <p>Your temporary password is: <strong>${tempPassword}</strong></p>
        <p>Please log in and reset your password after activation.</p>
        <br>
        <p>Best Regards,</p>
        <p>Greenfield University</p>
      `,
    }; // friendly hello, the activationLink, and tempPassword for first time login

    await transporter.sendMail(mailOptions);
    res.json({ message: "Activation email sent successfully!" }); // confirm email sent

  } catch (error) {
    console.error("Activation error:", error); //incase anything happens
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Handle Account Activation (When User Clicks Link)
router.get("/activate/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // 1️⃣ Find User by Activation Token
    const user = await Student.findOne({ where: { activationToken: token } }) || // find them by the activationToken we made
                 await Instructor.findOne({ where: { activationToken: token } });

    if (!user) {
      return res.status(400).send("Invalid or expired activation link.");
    }

    // 2️⃣ Activate Account
    await user.update({
      isAccountActive: true, // successful activation
      activationToken: null, // Remove token after activation
    });

    // 3️⃣ Render Activation Success Page with Email
    res.render("activation-success", { email: user.email }); // W!

  } catch (error) {
    console.error("Activation error:", error);
    res.status(500).send("Internal Server Error");
  }
});




export default router;
