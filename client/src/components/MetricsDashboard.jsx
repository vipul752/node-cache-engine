import { useState, useEffect } from "react";
import axios from "axios";

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState({
    hits: 0,
    misses: 0,
    evictions: 0,
    hitRate: 0,
  });

  const fetchMetrics = async () => {
    try {
      const res = await axios.get("/metrics");
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

  const cards = [
    {
      label: "Hits",
      value: formatNumber(metrics.hits),
      color: "bg-green-500",
      icon: "✓",
    },
    {
      label: "Misses",
      value: formatNumber(metrics.misses),
      color: "bg-red-500",
      icon: "✗",
    },
    {
      label: "Evictions",
      value: formatNumber(metrics.evictions),
      color: "bg-yellow-500",
      icon: "↻",
    },
    {
      label: "Hit Rate",
      value: (metrics.hitRate * 100).toFixed(1) + "%",
      color: "bg-blue-500",
      icon: "📊",
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>📈</span> Metrics Dashboard
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${card.color} rounded-lg p-4 text-white shadow-lg`}
          >
            <div className="text-3xl mb-1">{card.icon}</div>
            <div className="text-3xl font-bold">{card.value}</div>
            <div className="text-sm opacity-80">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
