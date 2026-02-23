import { useState, useEffect } from "react";
import api from "../api";

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState({
    hits: 0,
    misses: 0,
    evictions: 0,
    hitRate: 0,
  });

  const fetchMetrics = async () => {
    try {
      const res = await api.get("/metrics");
      setMetrics(res.data);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num;
  };

  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium text-gray-600 mb-3">Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded p-3">
          <div className="text-xs text-gray-500">Hits</div>
          <div className="text-xl font-semibold text-gray-800">
            {formatNumber(metrics.hits)}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-3">
          <div className="text-xs text-gray-500">Misses</div>
          <div className="text-xl font-semibold text-gray-800">
            {formatNumber(metrics.misses)}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-3">
          <div className="text-xs text-gray-500">Evictions</div>
          <div className="text-xl font-semibold text-gray-800">
            {formatNumber(metrics.evictions)}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-3">
          <div className="text-xs text-gray-500">Hit Rate</div>
          <div className="text-xl font-semibold text-gray-800">
            {(metrics.hitRate * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
