import jwt from "jsonwebtoken";
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    console.log("Received Token:", token); // Debugging line

    if (!token) {
        return res.status(403).json({ error: "Unauthorized access. Please log in." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        console.log("Decoded User:", req.user); // Debugging line
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error); // Debugging line
        return res.status(401).json({ error: "Invalid or expired token. Please log in again." });
    }
};
