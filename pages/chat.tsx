import { useState } from "react";
import Layout from "../components/Layout";

interface ChatMessage {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  isCurrentUser: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      author: "Aastha",
      avatar: "https://placehold.co/40x40/ca8a04/ffffff?text=A",
      time: "3:40 PM",
      text: "Backend structure is mostly done. I'm pushing the initial models now.",
      isCurrentUser: false,
    },
    {
      id: 2,
      author: "Aarti",
      avatar: "https://placehold.co/40x40/be185d/ffffff?text=A",
      time: "3:42 PM",
      text: "Great! Anushka and I will start integrating the pitch generator API then.",
      isCurrentUser: false,
    },
    {
      id: 3,
      author: "Dia",
      avatar: "https://placehold.co/40x40/38bdf8/ffffff?text=D",
      time: "3:45 PM",
      text: "Dashboard UI is coming along nicely! The progress chart is now live.",
      isCurrentUser: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newChatMessage: ChatMessage = {
      id: Date.now(),
      author: "Dia",
      avatar: "https://placehold.co/40x40/38bdf8/ffffff?text=D",
      time: timeString,
      text: newMessage,
      isCurrentUser: true,
    };

    setMessages([...messages, newChatMessage]);
    setNewMessage("");
  };

  const summarizeChat = async () => {
    setShowSummaryModal(true);
    setIsGeneratingSummary(true);

    // In a real app, this would be an API call to your backend
    // For demo purposes, we'll simulate a delay and then show a mock summary
    setTimeout(() => {
      setSummaryText(`
        <h3 class="font-semibold mb-2">Key Discussion Points:</h3>
        <ul class="list-disc pl-5 mb-4">
          <li>Backend structure completion by Aastha</li>
          <li>Pitch generator API integration planned by Aarti and Anushka</li>
          <li>Dashboard UI progress with working chart by Dia</li>
        </ul>
        
        <h3 class="font-semibold mb-2">Action Items:</h3>
        <ul class="list-disc pl-5 mb-4">
          <li>Review backend models (Assigned: Team)</li>
          <li>Continue dashboard development (Assigned: Dia)</li>
          <li>Begin API integration (Assigned: Aarti & Anushka)</li>
        </ul>
        
        <h3 class="font-semibold mb-2">Decisions Made:</h3>
        <ul class="list-disc pl-5">
          <li>Proceed with pitch generator integration as backend is ready</li>
          <li>Focus on completing core dashboard functionality before adding new features</li>
        </ul>
      `);
      setIsGeneratingSummary(false);
    }, 2000);
  };

  return (
    <Layout>
      <h2 className="text-display-md font-display text-gradient-primary mb-2 text-glow">
        Team Chat
      </h2>
      <p className="text-body-sm font-body text-zinc-400 mb-6 max-w-3xl">
        This is your central communication hub. All team chat happens here in
        real-time. If you need a quick catch-up on the conversation, use the
        'Summarize Chat with AI' button to get a condensed overview of recent
        discussions.
      </p>
      <div className="card h-[70vh] flex flex-col">
        <div className="flex justify-between items-center border-b border-zinc-700 pb-3 mb-4">
          <h3 className="text-heading-lg font-heading">#general</h3>
          <button onClick={summarizeChat} className="btn-primary text-sm">
            Summarize Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex items-start gap-3 chat-message"
            >
              <img
                src={message.avatar}
                className="w-10 h-10 rounded-full"
                alt={message.author}
              />
              <div>
                <p className="text-heading-sm font-heading">
                  {message.author}
                  <span className="text-caption text-zinc-500 ml-2">
                    {message.time}
                  </span>
                </p>
                <div
                  className={`${
                    message.isCurrentUser
                      ? "glass bg-gradient-to-r from-purple-600/20 to-pink-600/20"
                      : "glass"
                  } p-3 rounded-xl mt-1 inline-block message-text`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSendMessage}
          className="mt-4 pt-4 border-t border-zinc-700"
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="input-enhanced w-full placeholder-enhanced"
          />
        </form>
      </div>

      {/* AI Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="card w-full max-w-2xl">
            <h2 className="text-heading-xl font-heading mb-4">
              ✨ AI Chat Summary
            </h2>
            <div
              className="text-body-md font-body text-zinc-300 max-h-[60vh] overflow-y-auto pr-2"
              dangerouslySetInnerHTML={{
                __html: isGeneratingSummary
                  ? "<p>Generating summary...</p>"
                  : summaryText,
              }}
            />
            <button
              onClick={() => setShowSummaryModal(false)}
              className="w-full mt-6 btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
