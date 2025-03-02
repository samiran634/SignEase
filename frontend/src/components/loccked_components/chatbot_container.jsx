import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ChatbotContainer() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Function to send message and get a response from the chatbot
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    try {
      const response = await axios.post(
        `http://localhost:8080/ask`,
        // Send the data directly as the request body
        JSON.stringify(input), 
        // Put headers in the config object (third parameter)
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    
      console.log("Chatbot Response:", response.data);
      setMessages([...newMessages, { text: response.data, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }
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
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="Have questions? Ask here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 bg-blue-500 text-black px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
