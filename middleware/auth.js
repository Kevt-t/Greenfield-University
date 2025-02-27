import jwt from "jsonwebtoken";
import 'dotenv/config';

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Make sure the key matches what you set in login.js

  if (!token) {
    return res.status(401).redirect('/login');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(403).send('Invalid or expired token. Please log in again.');
    }

    req.user = decodedUser; // Attach decoded user to req.user
    next();
  });
};

export default authenticateToken;

