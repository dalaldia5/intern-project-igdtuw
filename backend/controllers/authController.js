const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/signup
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check karein ki user pehle se exist karta hai ya nahi
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Naya user banayein
        const user = await User.create({
            name,
            email,
            password,
        });

        // 3. Agar user ban gaya, to success response bhejein
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                message: 'User registered successfully!'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};


// @desc    Authenticate a user (Login)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user by email in the database
        const user = await User.findOne({ email });

        // 2. If user exists, compare the provided password with the stored hashed password
        if (user && (await bcrypt.compare(password, user.password))) {
            // Passwords match! Create a token.
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d', // Token expires in 30 days
            });

            // 3. Send back user info and the token
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token,
            });
        } else {
            // User not found or password doesn't match
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/me
const getUserProfile = async (req, res) => {
    // req.user ab 'protect' middleware se aa raha hai
    if (req.user) {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};


// Export both functions
module.exports = { registerUser, loginUser , getUserProfile};