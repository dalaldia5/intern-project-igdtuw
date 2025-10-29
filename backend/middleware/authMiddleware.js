const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protect = async (req, res, next) => {
  let token;

  try {
    // 🧭 Check for "Authorization: Bearer <token>"
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      // 🔍 Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 👤 Fetch the user and attach it to req.user (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      return next(); // ✅ Continue to next middleware/controller
    }

    // 🚫 No token case
    return res.status(401).json({ message: "Not authorized, no token provided" });
  } catch (error) {
    console.error("❌ AUTH ERROR:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please log in again" });
    }

    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

module.exports = { protect };
