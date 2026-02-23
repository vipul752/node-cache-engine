import { useState } from "react";
import axios from "axios";

export default function SetGetForm({ onSet }) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [ttl, setTtl] = useState("");
  const [getKey, setGetKey] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const handleSet = async (e) => {
    e.preventDefault();
    if (!key || !value) return;

    try {
      await axios.post("/set", {
        key,
        value,
        ttl: ttl ? parseInt(ttl) : null,
      });
      setMessage("✓ Value set successfully");
      setKey("");
      setValue("");
      setTtl("");
      onSet?.();
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage("✗ Failed to set value");
    }
  };

  const handleGet = async (e) => {
    e.preventDefault();
    if (!getKey) return;

    try {
      const res = await axios.get(`/get/${encodeURIComponent(getKey)}`);
      setResult(res.data.value);
    } catch (err) {
      setResult(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* SET Form */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📝</span> Set Value
        </h2>
        <form onSubmit={handleSet} className="space-y-3">
          <input
            type="text"
            placeholder="Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="TTL (ms) - optional"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold"
          >
            SET
          </button>
          {message && (
            <p
              className={`text-sm ${
                message.includes("✓") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      {/* GET Form */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🔍</span> Get Value
        </h2>
        <form onSubmit={handleGet} className="space-y-3">
          <input
            type="text"
            placeholder="Key"
            value={getKey}
            onChange={(e) => setGetKey(e.target.value)}
            className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
          >
            GET
          </button>
          {result !== null && (
            <div className="bg-slate-700 p-3 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">Result:</p>
              <p className="text-white font-mono text-sm break-all">
                {typeof result === "object"
                  ? JSON.stringify(result, null, 2)
                  : String(result)}
              </p>
            </div>
          )}
          {result === null && getKey && (
            <p className="text-gray-400 text-sm">No value found</p>
          )}
        </form>
      </div>
    </div>
  );
}
