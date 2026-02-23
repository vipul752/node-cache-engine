import { useState } from "react";
import api from "../api";

export default function NamespaceControl({ onDelete }) {
  const [namespace, setNamespace] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(true);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!namespace) return;

    try {
      await api.delete(`/namespace/${encodeURIComponent(namespace)}`);
      setMessage(`Deleted keys with prefix "${namespace}:"`);
      setSuccess(true);
      setNamespace("");
      onDelete?.();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to delete namespace");
      setSuccess(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-4 mb-6">
      <h2 className="text-sm font-medium text-gray-600 mb-3">
        Namespace Control
      </h2>
      <form onSubmit={handleDelete} className="flex gap-2">
        <input
          type="text"
          placeholder="Namespace (e.g., user)"
          value={namespace}
          onChange={(e) => setNamespace(e.target.value)}
          className="flex-1 border border-gray-300 text-gray-800 px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400"
        />
        <button
          type="submit"
          className="px-3 py-2 text-red-600 border border-red-200 hover:bg-red-50 rounded text-sm"
        >
          Delete All
        </button>
      </form>
      {message && (
        <p
          className={`mt-2 text-xs ${success ? "text-green-600" : "text-red-600"}`}
        >
          {message}
        </p>
      )}
      <p className="text-gray-400 text-xs mt-2">
        Deletes all keys starting with "namespace:"
      </p>
    </div>
  );
}
