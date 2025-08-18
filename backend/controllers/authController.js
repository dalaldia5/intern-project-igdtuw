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

        // 2. password ko hash kare
        // const salt = await bcrypt.genSalt(10); // Salt generate करें
        // const hashedPassword = await bcrypt.hash(password, salt); 

        // 3. Naya user banayein
        const user = await User.create({
            name,
            email,
            password: password,
        });

        // 4. Agar user ban gaya, to success response bhejein
        if (user) {
            // User bante hi token bhi banao aur bhejo
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token, // Token bhi saath mein bhejo
            });
        }else {
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
        console.log("\n--- NEW LOGIN ATTEMPT ---");
        console.log("1. User ne email aur password daala:", { email, password });

        const user = await User.findOne({ email });

        if (!user) {
            console.log("RESULT: User database mein nahi mila!");
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log("!!!! DATABASE FOUND THIS USER OBJECT !!!!:", user);


        console.log("2. Database se user mila. Uska saved password (hash) hai:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("3. Password compare karne ka result (isMatch):", isMatch, "<-- YEH SABSE ZAROORI HAI");

        if (isMatch) {
            console.log("RESULT: Password match ho gaya! Token bhej rahe hain.");
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token,
            });
        } else {
            console.log("RESULT: Password match nahi hua! Error bhej rahe hain.");
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("SERVER ERROR:", error);
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