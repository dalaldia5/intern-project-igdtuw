

const express = require('express');
const router = express.Router();

// ===== YEH NAYA MIDDLEWARE CODE ADD KAREIN =====
router.use((req, res, next) => {
    console.log('>>>>>>>>>> REQUEST RECEIVED BY authRoute.js! <<<<<<<<<<');
    next(); // Taaki request aage /signup route tak jaaye
});

// Import both functions now
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController.js');
// Middleware import karein
const { protect } = require('../middleware/authMiddleware.js');


// ===== NAYA DEBUGGING CODE START =====
console.log("--- DEBUGGING authRoute.js ---");
console.log("Type of registerUser is:", typeof registerUser);
console.log("----------------------------");
// ===== NAYA DEBUGGING CODE END =====

router.post('/signup', registerUser);
router.post('/login', loginUser); // <-- Add this new line for login

// Yeh naya protected route add karein
router.get('/me', protect, getUserProfile); // 'protect' middleware pehle chalega, phir 'getUserProfile' controller

module.exports = router;