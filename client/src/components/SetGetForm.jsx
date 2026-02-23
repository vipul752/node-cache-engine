import { useState } from "react";
import axios from "axios";

export default function SetGetForm({ onSet }) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [ttl, setTtl] = useState("");
  const [getKey, setGetKey] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(true);

  const handleSet = async (e) => {
    e.preventDefault();
    if (!key || !value) return;

    try {
      await axios.post("/set", {
        key,
        value,
        ttl: ttl ? parseInt(ttl) : null,
      });
      setMessage("Value set");
      setSuccess(true);
      setKey("");
      setValue("");
      setTtl("");
      onSet?.();
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage("Failed to set value");
      setSuccess(false);
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
      <div className="bg-white border border-gray-200 rounded p-4">
        <h2 className="text-sm font-medium text-gray-600 mb-3">Set Value</h2>
        <form onSubmit={handleSet} className="space-y-2">
          <input
            type="text"
            placeholder="Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full border border-gray-300 text-gray-800 px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400"
          />
          <input
            type="text"
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border border-gray-300 text-gray-800 px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400"
          />
          <input
            type="number"
            placeholder="TTL (ms) - optional"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            className="w-full border border-gray-300 text-gray-800 px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400"
          />
          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded text-sm"
          >
            SET
          </button>
          {message && (
            <p
              className={`text-xs ${success ? "text-green-600" : "text-red-600"}`}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded p-4">
        <h2 className="text-sm font-medium text-gray-600 mb-3">Get Value</h2>
        <form onSubmit={handleGet} className="space-y-2">
          <input
            type="text"
            placeholder="Key"
            value={getKey}
            onChange={(e) => setGetKey(e.target.value)}
            className="w-full border border-gray-300 text-gray-800 px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400"
          />
          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded text-sm"
          >
            GET
          </button>
          {result !== null && (
            <div className="bg-gray-50 border border-gray-100 p-2 rounded">
              <p className="text-gray-500 text-xs mb-1">Result:</p>
              <p className="text-gray-800 font-mono text-xs break-all">
                {typeof result === "object"
                  ? JSON.stringify(result, null, 2)
                  : String(result)}
              </p>
            </div>
          )}
          {result === null && getKey && (
            <p className="text-gray-400 text-xs">No value found</p>
          )}
        </form>
      </div>
    </div>
  );
}
