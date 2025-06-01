import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { MessageCircle, X, Send } from "lucide-react";
import { LuMessageCircle, LuX, LuSend } from "react-icons/lu";
import { postQuestion } from "../utils/dataFetching";

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", isBot: true },
  ]);

  const mutation = useMutation({
    mutationFn: postQuestion,
    onSuccess: (data) => {
      // Invalidate hoặc cập nhật cache sau khi tạo thành công
      const botResponse = {
        id: messages.length + 1,
        text: data,
        isBot: true,
      };
      setMessages((prev) => [...prev, botResponse]);
    },
    onError: (error) => {
      alert("Có lỗi xảy ra: " + error.message);
    },
  });

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (message.trim()) {
      mutation.mutate(message.trim());
      const newMessage = {
        id: messages.length + 1,
        text: message,
        isBot: false,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
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
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="w-10 h-10 bg-blue-500 hover:cursor-pointer hover:bg-blue-600 text-white rounded-full transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <LuSend className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
