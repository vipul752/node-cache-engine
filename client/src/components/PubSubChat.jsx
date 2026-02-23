import { useState, useEffect, useRef } from "react";
import api from "../api";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function PubSubChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [channel, setChannel] = useState("chat");
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const eventSourceRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(`${API_URL}/subscribe/${channel}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setConnected(true);
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: data,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    };

    eventSource.onerror = (e) => {
      console.log("SSE error, reconnecting...", e);
    };
  };

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setConnected(false);
    }
  };

  useEffect(() => {
    return () => disconnect();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await api.post("/publish", {
        channel,
        message: input,
      });
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-4 mb-6">
      <h2 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
        Pub/Sub Chat
        <span
          className={`w-2 h-2 rounded-full ${
            connected ? "bg-green-500" : "bg-gray-300"
          }`}
        />
      </h2>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Channel"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          disabled={connected}
          className="flex-1 border border-gray-300 text-gray-800 px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
        />
        {!connected ? (
          <button
            onClick={connect}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm"
          >
            Connect
          </button>
        ) : (
          <button
            onClick={disconnect}
            className="px-3 py-2 text-red-600 border border-red-200 hover:bg-red-50 rounded text-sm"
          >
            Disconnect
          </button>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded p-3 h-48 overflow-y-auto mb-3">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center text-sm mt-16">
            {connected ? "Waiting for messages..." : "Connect to start"}
          </p>
        ) : (
          <div className="space-y-1">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-2 text-sm">
                <span className="text-gray-400 text-xs">{msg.time}</span>
                <span className="text-gray-700">{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!connected}
          className="flex-1 border border-gray-300 text-gray-800 px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={!connected}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm disabled:bg-gray-300"
        >
          Send
        </button>
      </form>
    </div>
  );
}
