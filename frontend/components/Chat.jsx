import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuMessageCircle, LuX, LuSend } from "react-icons/lu";
import { postQuestion } from "../utils/dataFetching";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-xs px-4 py-2 bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">AI is typing...</span>
        </div>
      </div>
    </div>
  );
};

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", isBot: true },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const mutation = useMutation({
    mutationFn: postQuestion,
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: (data) => {
      setIsTyping(false);
      const botResponse = {
        id: messages.length + 1,
        text: data,
        isBot: true,
      };
      setMessages((prev) => [...prev, botResponse]);
    },
    onError: (error) => {
      setIsTyping(false);
      alert("Có lỗi xảy ra: " + error.message);
    },
  });

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (message.trim() && !mutation.isPending) {
      const userMessage = {
        id: Date.now(),
        text: message,
        isBot: false,
      };
      setMessages((prev) => [...prev, userMessage]);
      mutation.mutate(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={toggleChat}
            className="w-13 h-13 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 bg-blue-500 hover:bg-blue-600 hover:cursor-pointer"
          >
            <LuMessageCircle className="w-6 h-6 text-white mx-auto" />
          </button>
        </div>
      )}

      {/* Chatbox */}
      <div
        className={`fixed bottom-6 right-6 w-92 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ease-in-out transform z-40 ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        {/* Chat Header */}
        <div className="bg-blue-500 text-white p-4 rounded-t-2xl text-center relative">
          <button
            className="absolute left-3 top-0 bottom-0 my-auto hover:cursor-pointer hover:opacity-80"
            onClick={toggleChat}
          >
            <LuX className="w-5 h-5 text-white" />
          </button>
          <h3 className="font-semibold text-lg">Chat Assistant</h3>
        </div>

        {/* Messages Area */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  msg.isBot
                    ? "bg-gray-100 text-gray-800 rounded-bl-sm"
                    : "bg-blue-500 text-white rounded-br-sm"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}

          {isTyping && <TypingIndicator />}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={mutation.isPending}
              className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none ${
                mutation.isPending ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
            <button
              onClick={sendMessage}
              disabled={mutation.isPending || !message.trim()}
              className={`w-10 h-10 text-white rounded-full transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                mutation.isPending || !message.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:cursor-pointer hover:bg-blue-600"
              }`}
            >
              {mutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <LuSend className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
