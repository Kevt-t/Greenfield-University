import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware to check if user is authenticated
export const authenticateUser = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    return res.redirect("/login"); // Redirect to login if no token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.redirect("/login");
  }
};
