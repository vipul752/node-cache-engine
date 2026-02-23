import { useState } from "react";
import MetricsDashboard from "./components/MetricsDashboard";
import CacheViewer from "./components/CacheViewer";
import SetGetForm from "./components/SetGetForm";
import PubSubChat from "./components/PubSubChat";
import NamespaceControl from "./components/NamespaceControl";

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-4xl">⚡</span>
            Node Cache Engine
            <span className="text-sm bg-blue-500 px-2 py-1 rounded ml-2">
              Dashboard
            </span>
          </h1>
          <p className="text-gray-400 mt-2">
            Real-time cache monitoring and management
          </p>
        </header>

        {/* Metrics */}
        <MetricsDashboard />

        {/* SET/GET Forms */}
        <SetGetForm onSet={triggerRefresh} />

        {/* Cache Viewer + Namespace Control */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <CacheViewer onRefresh={refreshKey} />
          </div>
          <div>
            <NamespaceControl onDelete={triggerRefresh} />
          </div>
        </div>

        {/* Pub/Sub Chat */}
        <PubSubChat />

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-8">
          Built with LRU + TTL + Pub/Sub • Node.js + React
        </footer>
      </div>
    </div>
  );
}
