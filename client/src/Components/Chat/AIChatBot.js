import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BsRobot } from "react-icons/bs";
import { IoSend, IoClose } from "react-icons/io5";

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI assistant. Ask me anything - coding help, doubts, or just say hello." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      // Send prior turns as history (skip the very first canned greeting)
      const history = newMessages
        .slice(1, -1)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/ask`,
        { message: trimmed, history },
        { timeout: 30000 }
      );

      setMessages((prev) => [...prev, { role: "assistant", content: response.data.reply }]);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === "ECONNABORTED" ? "The bot is taking too long to respond. Try again." : "Something went wrong. Please try again.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div>
      {/* Floating toggle button - bottom-left so it doesn't collide with the Help button */}
      <button
        className="fixed bottom-6 left-6 bg-indigo-600 text-white p-5 rounded-full text-lg hover:bg-indigo-500 hover:scale-105 transition-transform shadow-lg z-40"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI assistant"
      >
        <BsRobot className="w-full h-full" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 w-80 sm:w-96 h-[500px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <BsRobot className="text-indigo-400 text-xl" />
              <h2 className="text-white font-semibold">AI Assistant</h2>
            </div>
            <button
              className="text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI assistant"
            >
              <IoClose size={22} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white self-end rounded-br-sm"
                    : "bg-gray-700 text-gray-100 self-start rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="bg-gray-700 text-gray-300 self-start px-3 py-2 rounded-xl text-sm rounded-bl-sm">
                Thinking...
              </div>
            )}
            {error && (
              <div className="text-red-400 text-xs text-center">{error}</div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-700 flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              className="flex-1 resize-none bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              aria-label="Send message"
            >
              <IoSend size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatBot;
