"use client";
import { useState } from "react";
import Layout from "../components/Layout";

export default function Pitch() {
  const [pitchInput, setPitchInput] = useState("");
  const [pitchOutput, setPitchOutput] = useState(
    "Your generated pitch will appear here..."
  );
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantOutput, setAssistantOutput] = useState(
    "Click the button below for improvement ideas!"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImprovements, setIsGeneratingImprovements] =
    useState(false);

  // ✅ Use environment variable (auto switches between localhost & Render)
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // ✅ Generate Pitch using Gemini API
  const generatePitch = async () => {
    if (!pitchInput.trim()) {
      setPitchOutput("⚠ Please enter some bullet points first.");
      return;
    }

    setIsGenerating(true);
    setPitchOutput("Generating your pitch using Gemini AI...");

    try {
      const res = await fetch(`${API_BASE}/gemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: pitchInput }),
      });

      const data = await res.json();

      if (data.pitch) {
        setPitchOutput(data.pitch);
        setShowAssistant(true);
      } else {
        setPitchOutput("❌ Failed to generate pitch. Try again.");
      }
    } catch (err) {
      console.error(err);
      setPitchOutput("⚠ Error generating pitch. Please try again later.");
    }

    setIsGenerating(false);
  };

  // ✅ Get Improvements using Gemini API
  const getPitchImprovements = async () => {
    if (!pitchOutput || pitchOutput.startsWith("⚠")) return;

    setIsGeneratingImprovements(true);
    setAssistantOutput("Analyzing your pitch for improvements...");

    try {
      const res = await fetch(`${API_BASE}/gemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: `Suggest improvements for this startup pitch:\n\n${pitchOutput}`,
        }),
      });

      const data = await res.json();

      if (data.pitch) {
        setAssistantOutput(data.pitch);
      } else {
        setAssistantOutput("❌ Could not analyze pitch. Try again.");
      }
    } catch (err) {
      console.error(err);
      setAssistantOutput("⚠ Error analyzing improvements.");
    }

    setIsGeneratingImprovements(false);
  };

  return (
    <Layout>
      <h2 className="text-display-md font-display text-gradient-primary mb-2 text-glow">
        AI Pitch Generator
      </h2>
      <p className="text-body-sm font-body text-zinc-400 mb-6 max-w-3xl">
        Struggling to articulate your project's vision? Enter your core ideas
        as bullet points below. Our AI assistant will generate a concise, 
        compelling summary perfect for your final pitch.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="card">
          <h3 className="text-heading-lg font-heading mb-4">
            Your Bullet Points
          </h3>
          <textarea
            value={pitchInput}
            onChange={(e) => setPitchInput(e.target.value)}
            className="input-enhanced w-full h-64 text-body-sm font-mono placeholder-enhanced"
            placeholder={`- AI-powered collaboration hub
- Real-time task tracking
- Automated pitch generation
- Centralized file storage`}
          ></textarea>
          <button
            onClick={generatePitch}
            disabled={isGenerating}
            className={`w-full mt-4 ${
              isGenerating
                ? "btn-secondary opacity-50 cursor-not-allowed"
                : "btn-primary"
            }`}
          >
            {isGenerating ? "Generating..." : "Generate Pitch"}
          </button>
        </div>

        {/* Right Panel */}
        <div className="card">
          <h3 className="text-heading-lg font-heading mb-4">
            Generated Pitch Summary
          </h3>
          <div className="w-full h-64 glass rounded-xl border border-dashed border-zinc-600 p-4 text-body-sm font-body text-zinc-400 overflow-y-auto whitespace-pre-line">
            {pitchOutput}
          </div>

          {showAssistant && (
            <div className="mt-4">
              <h4 className="text-heading-md font-heading mb-2">
                AI Assistant Suggestion
              </h4>
              <p className="text-body-sm font-body glass p-3 rounded-xl border border-zinc-700 whitespace-pre-line">
                {assistantOutput}
              </p>
              <button
                onClick={getPitchImprovements}
                disabled={isGeneratingImprovements}
                className={`w-full mt-2 ${
                  isGeneratingImprovements
                    ? "btn-secondary opacity-50 cursor-not-allowed"
                    : "btn-secondary"
                } text-sm`}
              >
                {isGeneratingImprovements
                  ? "Analyzing..."
                  : "✨ Suggest Improvements"}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
