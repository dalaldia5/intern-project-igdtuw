import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAppContext } from "../context/AppContext";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";


interface ChatMessage {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  isCurrentUser: boolean;
}

export default function Chat() {
  const { currentUser, teamMembers } = useAppContext();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // ------------------- Fetch Messages from Backend -------------------
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/chat");
        const fetched = res.data.map((m: any, i: number) => ({
          id: i,
          author: m.author,
          avatar:
            m.author === currentUser?.name
              ? currentUser?.avatar ||
                "https://placehold.co/40x40/8b5cf6/ffffff?text=U"
              : "https://placehold.co/40x40/38bdf8/ffffff?text=T",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: m.message,
          isCurrentUser: m.author === currentUser?.name,
        }));
        setMessages(fetched);
      } catch (err) {
        console.error("❌ Error fetching chat:", err);
      }
    };
    fetchMessages();
  }, [currentUser]);

  // ------------------- Send New Message -------------------
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newChatMessage: ChatMessage = {
      id: Date.now(),
      author: currentUser?.name || "You",
      avatar:
        currentUser?.avatar ||
        "https://placehold.co/40x40/8b5cf6/ffffff?text=U",
      time: timeString,
      text: newMessage,
      isCurrentUser: true,
    };

    setMessages((prev) => [...prev, newChatMessage]);
    setNewMessage("");

    // Save message to backend
    try {
      await axios.post("http://127.0.0.1:5000/chat", {
        author: currentUser?.name || "You",
        message: newMessage,
      });
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }

    // Optional: simulate teammate reply for demo
    if (teamMembers.length > 0) {
      setTimeout(() => {
        const randomMember =
          teamMembers[Math.floor(Math.random() * teamMembers.length)];

        const reply: ChatMessage = {
          id: Date.now() + 1,
          author: randomMember.name,
          avatar: randomMember.avatar,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: `Got it, ${currentUser?.name || "there"}!`,
          isCurrentUser: false,
        };

        setMessages((prev) => [...prev, reply]);
      }, 1500);
    }
  };

  // ------------------- Summarize Chat via Flask API -------------------
  const summarizeChat = async () => {
    setShowSummaryModal(true);
    setIsGeneratingSummary(true);

    try {
      const chatPayload = {
        chat: messages.map((m) => ({ message: m.text })),
      };

      const response = await axios.post(
        "http://127.0.0.1:5000/summarize",
        chatPayload
      );

      setSummaryText(response.data.summary);
    } catch (error) {
      console.error("❌ Error summarizing chat:", error);
      setSummaryText("❌ Failed to generate summary. Please try again.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // ------------------- UI -------------------
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
            <div key={message.id} className="flex items-start gap-3 chat-message">
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

      {/* ------------------- AI Summary Modal ------------------- */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="card w-full max-w-2xl">
            <h2 className="text-heading-xl font-heading mb-4">
              ✨ AI Chat Summary
            </h2>

            <div className="text-body-md font-body text-zinc-300 max-h-[60vh] overflow-y-auto pr-2">
              {isGeneratingSummary ? (
                <p>Generating summary...</p>
              ) : (
                <p className="whitespace-pre-line">{summaryText}</p>
              )}
            </div>

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
