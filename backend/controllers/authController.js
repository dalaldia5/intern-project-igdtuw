const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* =====================================
   @desc   Register a new user
   @route  POST /api/auth/signup
===================================== */
const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    email = email.trim().toLowerCase();
    password = password.trim();

    // 1️⃣ Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2️⃣ Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3️⃣ Create user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4️⃣ Return JWT token with response
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

/* =====================================
   @desc   Authenticate user (Login)
   @route  POST /api/auth/login
===================================== */
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();
    password = password.trim();

    console.log("\n--- NEW LOGIN ATTEMPT ---");
    console.log("User entered:", { email, password });

    // 1️⃣ Find user
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found in DB!");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2️⃣ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // 4️⃣ Send response
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("LOGIN SERVER ERROR:", error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

/* =====================================
   @desc   Get logged in user profile
   @route  GET /api/auth/me
===================================== */
const getUserProfile = async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
