import { useState, useEffect, useRef } from "react";
import axios from "axios";

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

    const eventSource = new EventSource(`/subscribe/${channel}`);
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
      // Don't disconnect - EventSource will auto-reconnect
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
      await axios.post("/publish", {
        channel,
        message: input,
      });
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>💬</span> Pub/Sub Chat
        <span
          className={`ml-2 w-2 h-2 rounded-full ${
            connected ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </h2>

      {/* Channel Controls */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Channel"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          disabled={connected}
          className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        />
        {!connected ? (
          <button
            onClick={connect}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
          >
            Connect
          </button>
        ) : (
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
          >
            Disconnect
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="bg-slate-900 rounded-lg p-3 h-64 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-20">
            {connected ? "Waiting for messages..." : "Connect to start"}
          </p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-2">
                <span className="text-gray-500 text-xs">{msg.time}</span>
                <span className="text-white">{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!connected}
          className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!connected}
          className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
