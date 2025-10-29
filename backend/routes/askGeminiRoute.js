const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { idea } = req.body;
    console.log("🧠 Received idea:", idea);

    if (!idea || idea.trim().length === 0) {
      return res.status(400).json({ error: "No idea provided" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY missing");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `Generate a short startup pitch for this idea:\n\n${idea}`;
    console.log("Prompt:", prompt);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ pitch: text });
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    res.status(500).json({ error: err.message || "Error generating pitch" });
  }
});

module.exports = router;
