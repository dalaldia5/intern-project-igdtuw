console.log("--- SERVER.JS FILE LOADED - LATEST VERSION ---");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

// Import routes
const authRoute = require("./routes/authRoute.js");
const teamRoute = require("./routes/teamRoute.js");
const taskRoute = require("./routes/taskRoute.js");

// Initialize express app
const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Logger + JSON middleware
app.use(morgan("dev"));
app.use(express.json());

// ✅ MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ Failed to connect to MongoDB:", err));

// ✅ Test route
app.get("/test", (req, res) => {
  console.log("🎯 TEST ROUTE HIT SUCCESSFULLY");
  res.status(200).send("<h1>Test Route Working Fine ✅</h1>");
});

// ✅ Register all routes
app.use("/api/auth", authRoute);
app.use("/api/teams", teamRoute);
app.use("/api/tasks", taskRoute);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
