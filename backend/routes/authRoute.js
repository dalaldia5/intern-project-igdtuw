const express = require("express");
const router = express.Router();

// 🧭 Middleware for debugging each request
router.use((req, res, next) => {
  console.log(`➡️ [authRoute.js] ${req.method} ${req.originalUrl} request received`);
  next(); // Aage controller tak jaane do
});

// 🧩 Import controllers
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController.js");

// 🛡️ Import auth middleware
const { protect } = require("../middleware/authMiddleware.js");

// 🧠 Quick Debug Info
console.log("--- DEBUGGING authRoute.js ---");
console.log("registerUser typeof:", typeof registerUser);
console.log("loginUser typeof:", typeof loginUser);
console.log("getUserProfile typeof:", typeof getUserProfile);
console.log("----------------------------");

// 📝 Routes

// ➕ Signup route
router.post("/signup", registerUser);

// 🔐 Login route
router.post("/login", loginUser);

// 👤 Get user profile (Protected)
router.get("/me", protect, getUserProfile);

// ✅ Verify Token (check if still valid)
router.get("/verify", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token is valid",
    user: req.user,
  });
});


// ✅ Export router
module.exports = router;
