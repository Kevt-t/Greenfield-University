export const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    return res.status(401).json({ redirect: "/login", error: "Authentication required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request

    // Fetch user from DB to check `requiresPasswordReset`
    let user = await Student.findOne({ where: { id: decoded.id } }) ||
               await Instructor.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ redirect: "/login", error: "User not found." });
    }

    // 🔥 Instead of redirecting, send JSON response
    if (user.requiresPasswordReset) {
      return res.status(403).json({ redirect: "/reset-password", message: "You must reset your password." });
    }

    next(); // ✅ Allow request to proceed
  } catch (error) {
    return res.status(401).json({ redirect: "/login", error: "Invalid or expired token." });
  }
};
