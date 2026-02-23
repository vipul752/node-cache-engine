import { useState } from "react";
import axios from "axios";

export default function NamespaceControl({ onDelete }) {
  const [namespace, setNamespace] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!namespace) return;

    try {
      await axios.delete(`/namespace/${encodeURIComponent(namespace)}`);
      setMessage(`✓ Deleted all keys with prefix "${namespace}:"`);
      setNamespace("");
      onDelete?.();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("✗ Failed to delete namespace");
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>🗂️</span> Namespace Control
      </h2>
      <form onSubmit={handleDelete} className="flex gap-2">
        <input
          type="text"
          placeholder="Namespace (e.g., user)"
          value={namespace}
          onChange={(e) => setNamespace(e.target.value)}
          className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold"
        >
          Delete All
        </button>
      </form>
      {message && (
        <p
          className={`mt-2 text-sm ${
            message.includes("✓") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
      <p className="text-gray-500 text-xs mt-2">
        Deletes all keys starting with "namespace:"
      </p>
    </div>
  );
}
