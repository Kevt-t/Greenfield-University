import express from "express";
import Student from "../models/student/students.js";
import bcrypt from "bcrypt";

const router = express.Router();

//Reset Password Route
router.post("/", async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const studentID = req.session.studentID;
  
    if (!studentID) return res.status(400).send("Session expired. Please log in again.");
  
    try {
      const student = await Student.findByPk(studentID);
      const isMatch = await bcrypt.compare(currentPassword, student.password);
  
      if (!isMatch) return res.status(400).send("Incorrect current password.");
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await Student.update({ password: hashedPassword, isTemporaryPassword: false }, { where: { studentID } });
  
      res.send("Password updated successfully!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating password.");
    }
  });
  

export default router;
