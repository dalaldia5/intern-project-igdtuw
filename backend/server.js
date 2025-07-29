require('dotenv').config(); // <-- This MUST be first
const express = require('express');
const mongoose = require('mongoose');
// ...

// Apne routes ko import karein
const authRoute = require('./routes/authRoute.js');
const teamRoute = require('./routes/teamRoute.js'); // <-- ADD THIS
const taskRoute = require('./routes/taskRoute.js'); // 👈 ADD THIS


const app = express();

// Yeh middleware gelen JSON data (req.body) ko padhne ke liye zaroori hai
app.use(express.json());

// Database Connection
const MONGO_URI = "mongodb+srv://aasthagc01:aastapass123@cluster0.rsk1e5d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));


// Jab bhi koi /api/auth se shuru hone wala URL aaye, to use authRoute file handle karegi
app.use('/api/auth', authRoute);
app.use('/api/teams', teamRoute); // <-- AND ADD THIS
app.use('/api/tasks', taskRoute); // 👈 AND ADD THIS


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});