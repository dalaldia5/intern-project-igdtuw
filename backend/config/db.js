const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // ===== DEBUGGING START =====
    // Yeh check karega ki .env file se URI sahi se aa rahi hai ya nahi
    console.log("--- DEBUGGING MONGO_URI ---");
    console.log("Attempting to connect with this URI:");
    console.log(process.env.MONGO_URI);
    console.log("-----------------------------");
    // ===== DEBUGGING END =====

    // Database se connect karne ki koshish karega
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    // Agar connection fail hota hai, toh server band ho jaayega
    process.exit(1);
  }
};

module.exports = connectDB;