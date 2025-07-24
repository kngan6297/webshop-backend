const { verifyToken } = require("../config/jwt");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ message: "Invalid token or user inactive." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

const isAdmin = authorize("admin");
const isUser = authorize("user", "admin");

module.exports = {
  authenticate,
  authorize,
  isAdmin,
  isUser,
};
