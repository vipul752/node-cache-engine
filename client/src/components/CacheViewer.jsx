import { useState, useEffect } from "react";
import axios from "axios";

export default function CacheViewer({ onRefresh }) {
  const [keys, setKeys] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/keys");
      setKeys(res.data);
    } catch (err) {
      console.error("Failed to fetch keys:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKeys();
  }, [onRefresh]);

  const handleDelete = async (key) => {
    try {
      await axios.delete(`/delete/${encodeURIComponent(key)}`);
      fetchKeys();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const filteredKeys = keys.filter((item) =>
    item.key.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>🗃️</span> Cache Viewer
      </h2>

      <input
        type="text"
        placeholder="Search keys..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : filteredKeys.length === 0 ? (
          <p className="text-gray-400">No keys found</p>
        ) : (
          <div className="space-y-2">
            {filteredKeys.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between bg-slate-700 p-3 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-blue-400 font-mono text-sm truncate">
                    {item.key}
                  </div>
                  <div className="text-gray-300 text-sm truncate">
                    {typeof item.value === "object"
                      ? JSON.stringify(item.value)
                      : String(item.value)}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.key)}
                  className="ml-3 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={fetchKeys}
        className="mt-4 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm"
      >
        🔄 Refresh
      </button>
    </div>
  );
}
