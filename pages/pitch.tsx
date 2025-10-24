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

  const generatePitch = async () => {
    if (!pitchInput.trim()) {
      setPitchOutput("Please enter some bullet points first.");
      return;
    }

    setIsGenerating(true);
    setPitchOutput("Generating your pitch...");

    // In a real app, this would call your backend API which would use the AI service
    // For demo, we'll simulate a delay and then show a mock response
    setTimeout(() => {
      const mockPitch = `
# HackHub: Revolutionizing Hackathon Collaboration

HackHub is an all-in-one collaboration platform designed specifically for hackathon teams. Our solution addresses the common challenges teams face during intense development sprints by providing:

- **Real-time task tracking** with an intuitive Kanban board that keeps everyone synchronized
- **AI-powered pitch generation** that transforms bullet points into compelling presentations
- **Centralized communication hub** with smart summarization to catch up on discussions quickly
- **Integrated file repository** for seamless sharing of resources and documentation

By streamlining team coordination and automating routine tasks, HackHub empowers developers to focus on what truly matters - building innovative solutions. Our platform increases team productivity by an estimated 30% while reducing the stress of hackathon deadlines.

Join the future of hackathon collaboration with HackHub - where great ideas meet seamless execution.
      `;

      setPitchOutput(mockPitch);
      setShowAssistant(true);
      setIsGenerating(false);
    }, 2000);
  };

  const getPitchImprovements = async () => {
    setIsGeneratingImprovements(true);
    setAssistantOutput("Analyzing for improvements...");

    // Again, in a real app this would be an API call
    setTimeout(() => {
      const mockImprovements = `
1. **Add Quantifiable Metrics**: Include specific statistics about how much time HackHub saves or how many teams have successfully used it.

2. **Highlight Technical Differentiation**: Mention the specific technologies powering your platform (e.g., real-time database, NLP for summarization).

3. **Include a Clear Call-to-Action**: End with a specific next step for interested hackathon organizers or participants.
      `;

      setAssistantOutput(mockImprovements);
      setIsGeneratingImprovements(false);
    }, 2000);
  };

  return (
    <Layout>
      <h2 className="text-display-md font-display text-gradient-primary mb-2 text-glow">
        AI Pitch Generator
      </h2>
      <p className="text-body-sm font-body text-zinc-400 mb-6 max-w-3xl">
        Struggling to articulate your project's vision? Simply enter your core
        ideas as bullet points in the text area below. Our AI assistant will
        analyze them and generate a concise, compelling summary perfect for your
        final pitch.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-heading-lg font-heading mb-4">
            Your Bullet Points
          </h3>
          <textarea
            value={pitchInput}
            onChange={(e) => setPitchInput(e.target.value)}
            className="input-enhanced w-full h-64 text-body-sm font-mono placeholder-enhanced"
            placeholder="- AI-powered collaboration hub&#x0a;- Real-time task tracking&#x0a;- Automated pitch generation&#x0a;- Centralized file storage"
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
            {isGenerating ? "Generating..." : "✨ Generate Pitch"}
          </button>
        </div>
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
