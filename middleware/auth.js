import jwt from "jsonwebtoken";
import 'dotenv/config';

// Middleware function to authenticate the token
const authToken = (req, res, next) => {
  const token = req.cookies.token; // Make sure this matches the cookie set in login.js

  if (!token) {
    return res.status(401).redirect('/login');
  }

  // Verify token and attach user data to request
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(403).send('Invalid or expired token. Please log in again.');
    }

    // Ensure `req.user` gets assigned correctly
    req.user = decodedUser;

    // Debugging: Check what `decodedUser` contains
    console.log("Decoded User:", decodedUser);

    next();
  });
};

export default authToken;
