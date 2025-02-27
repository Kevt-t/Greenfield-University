import express from "express";
import Payment from "../models/finance/payments.js";
import Fee from "../models/finance/fees.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

router.get("/pay-fees", authenticateToken, async (req, res) => {
    if (req.user.role !== "Student") {
        return res.redirect("/login");
    }
    
    // Fetch student fees
    const fees = await Fee.findAll({
        where: { studentID: req.user.studentID, status: "Pending" }
    });

    res.render("pay-fees", { fees });
});

// Payment Processing Route
router.post("/pay-fees", authenticateToken, async (req, res) => {
    try {
        const { feeID, amount, method } = req.body;
        const studentID = req.user.studentID;

        // Ensure Fee Exists and Belongs to Student
        const fee = await Fee.findOne({ where: { feeID, studentID, status: "Pending" } });
        if (!fee) {
            return res.status(400).json({ error: "Invalid fee selection." });
        }

        // Create a Payment Record
        await Payment.create({
            studentID,
            feeID,
            amount,
            method,
            paymentDate: new Date(),
            status: "Successful"
        });

        // Mark Fee as Paid
        await fee.update({ status: "Paid" });

        res.json({ message: "Payment successful!" });

    } catch (error) {
        console.error("Payment Error:", error);
        res.status(500).json({ error: "Payment failed. Try again later." });
    }
});

export default router;
