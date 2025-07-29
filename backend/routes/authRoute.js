

const express = require('express');
const router = express.Router();
// Import both functions now
const { registerUser, loginUser } = require('../controllers/authController.js');

router.post('/register', registerUser);
router.post('/login', loginUser); // <-- Add this new line for login

module.exports = router;