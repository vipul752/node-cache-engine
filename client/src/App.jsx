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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Node Cache Engine
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Cache monitoring and management
          </p>
        </header>

        <MetricsDashboard />
        <SetGetForm onSet={triggerRefresh} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <CacheViewer onRefresh={refreshKey} />
          </div>
          <div>
            <NamespaceControl onDelete={triggerRefresh} />
          </div>
        </div>

        <PubSubChat />

        <footer className="text-center text-gray-400 text-xs mt-8">
          LRU + TTL + Pub/Sub
        </footer>
      </div>
    </div>
  );
}
