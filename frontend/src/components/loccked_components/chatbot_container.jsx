import React, { useState } from "react";

export default function ChatbotContainer() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-md h-full md:h-[90vh] mx-auto bg-white shadow-lg rounded-lg border border-gray-300 mt-8">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg w-fit max-w-[80%] ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-300 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input field */}
      <div className="p-3 border-t flex items-center bg-white">
        <input
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Have questions? Ask here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUpCapture={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
