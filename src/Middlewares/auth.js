const jwt = require("jsonwebtoken");

// JWT Secret - should match the one in user-controller.js
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here";

const authenticateToken = (req, res, next) => {
  // Try to get token from Authorization header first (for backward compatibility)
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  // Try to get token from cookies (for cookie-based authentication)
  const cookieToken = req.cookies?.token;

  // Use cookie token if available, otherwise fall back to bearer token
  const token = cookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access token required",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
};
