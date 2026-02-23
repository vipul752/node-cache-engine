import { useState, useEffect } from "react";
import api from "../api";

export default function CacheViewer({ onRefresh }) {
  const [keys, setKeys] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await api.get("/keys");
      if (!Array.isArray(res.data)) throw new Error("Invalid response");
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
      await api.delete(`/delete/${encodeURIComponent(key)}`);
      fetchKeys();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const filteredKeys = keys.filter((item) =>
    item.key.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-white border border-gray-200 rounded p-4 mb-6">
      <h2 className="text-sm font-medium text-gray-600 mb-3">Cache Viewer</h2>

      <input
        type="text"
        placeholder="Search keys..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 text-gray-800 px-3 py-2 rounded mb-3 text-sm focus:outline-none focus:border-gray-400"
      />

      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : filteredKeys.length === 0 ? (
          <p className="text-gray-400 text-sm">No keys found</p>
        ) : (
          <div className="space-y-2">
            {filteredKeys.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between bg-gray-50 border border-gray-100 p-2 rounded"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-gray-700 font-mono text-xs truncate">
                    {item.key}
                  </div>
                  <div className="text-gray-500 text-xs truncate">
                    {typeof item.value === "object"
                      ? JSON.stringify(item.value)
                      : String(item.value)}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.key)}
                  className="ml-3 px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs"
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
        className="mt-3 px-3 py-1 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded text-sm"
      >
        Refresh
      </button>
    </div>
  );
}
