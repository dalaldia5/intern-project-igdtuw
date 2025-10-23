console.log("--- SERVER.JS FILE LOADED - LATEST VERSION ---"); // <-- YEH NAYI LINE ADD KAREIN


require('dotenv').config(); // Step 1: Sabse pehle .env ko load karein
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

// Saare routes ko import karein
const authRoute = require('./routes/authRoute.js');

// ===== NAYA DEBUGGING CODE in server.js =====
console.log("--- DEBUGGING server.js ---");
console.log("Imported authRoute object:", authRoute);
console.log("---------------------------");

const teamRoute = require('./routes/teamRoute.js');
const taskRoute = require('./routes/taskRoute.js');

// Step 2: Express app ko banayein
const app = express();
app.use(cors());
app.use(morgan('dev'));

// Step 3: Middleware ko routes se PEHLE use karein
// Yeh gelen JSON data (req.body) ko padhne ke liye zaroori hai
app.use(express.json());

// Step 4: Database Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// ===== NAYA TEST ROUTE =====
app.get('/test', (req, res) => {
    console.log("!!!!!!!!!!!!!! TEST ROUTE SUCCESS !!!!!!!!!!!!!!");
    res.status(200).send('<h1>Test Route is Working!</h1>');
});

// Step 5: Apne Routes ko register karein
app.use('/api/auth', authRoute);
app.use('/api/teams', teamRoute);
app.use('/api/tasks', taskRoute);

// Step 6: Server ko start karein
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});