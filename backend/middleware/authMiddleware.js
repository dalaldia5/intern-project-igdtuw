const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protect = async (req, res, next) => {
  let token;

  // 🧭 Check for Authorization header and Bearer token
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      // 🪙 Extract token after "Bearer "
      token = req.headers.authorization.split(" ")[1];

      // 🔍 Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 👤 Attach user to request (without password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      // ✅ Continue to next middleware/controller
      return next();
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  }

  // 🚫 No token found at all
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
