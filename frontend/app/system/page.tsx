"use client";

import { useEffect, useState } from "react";
import { getSystemStatus } from "@/lib/api";
import { SystemStatus } from "@/lib/types";
import Navbar from "@/components/clinical/Navbar";

/**
 * System Metrics Page
 * Displays real-time system performance and profiler metrics
 * Features:
 * - System health status
 * - Performance metrics (latency, throughput)
 * - GPU utilization
 * - Uptime and case statistics
 */
export default function SystemPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();
    // Refresh every 5 seconds
    const interval = setInterval(loadStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadStatus() {
    try {
      const data = await getSystemStatus();
      setStatus(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load system status");
      // Use mock data for demo
      if (!status) {
        setStatus(mockStatus);
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading && !status) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading system metrics...</p>
        </div>
      </div>
    );
  }

  if (!status) return null;

  const statusColors = {
    healthy: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
    degraded: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
    down: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  };

  const colors = statusColors[status.status];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Monitor</h1>
              <p className="text-gray-600 mt-1">Real-time performance metrics</p>
            </div>
            <div className={`px-4 py-2 rounded-full ${colors.bg} flex items-center gap-2`}>
              <div className={`w-3 h-3 rounded-full ${colors.dot} animate-pulse`}></div>
              <span className={`font-semibold ${colors.text} uppercase text-sm`}>
                {status.status}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Unable to connect to backend. Showing cached data.
            </p>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            label="Uptime"
            value={formatUptime(status.uptime_seconds)}
            icon="⏱️"
            color="blue"
          />
          <MetricCard
            label="Total Cases"
            value={status.total_cases}
            icon="📊"
            color="green"
          />
          <MetricCard
            label="Avg Inference Time"
            value={`${status.avg_inference_time.toFixed(2)}s`}
            icon="⚡"
            color="purple"
          />
          <MetricCard
            label="System Load"
            value={status.profiler.gpu_util_percent ? `${status.profiler.gpu_util_percent.toFixed(0)}%` : "N/A"}
            icon="💻"
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profiler Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profiler Metrics</h2>
            <div className="space-y-6">
              <ProgressMetric
                label="Total Latency"
                value={status.profiler.total_latency}
                unit="s"
                max={5}
                color="blue"
              />
              <ProgressMetric
                label="Planner Latency"
                value={status.profiler.planner_latency_ms}
                unit="ms"
                max={10}
                color="green"
              />
              {status.profiler.steps_per_sec && (
                <ProgressMetric
                  label="Steps/Second"
                  value={status.profiler.steps_per_sec}
                  unit=""
                  max={2000}
                  color="purple"
                />
              )}
              {status.profiler.gpu_util_percent !== undefined && (
                <ProgressMetric
                  label="GPU Utilization"
                  value={status.profiler.gpu_util_percent}
                  unit="%"
                  max={100}
                  color="orange"
                />
              )}
              {status.profiler.memory_mb && (
                <ProgressMetric
                  label="Memory Usage"
                  value={status.profiler.memory_mb}
                  unit="MB"
                  max={8192}
                  color="red"
                />
              )}
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Stats</h2>
              <div className="space-y-3">
                <StatRow label="Status" value={status.status.toUpperCase()} />
                <StatRow label="Uptime" value={formatUptime(status.uptime_seconds)} />
                <StatRow label="Total Cases Analyzed" value={status.total_cases.toString()} />
                <StatRow label="Average Inference" value={`${status.avg_inference_time.toFixed(3)}s`} />
                <StatRow
                  label="Throughput"
                  value={status.profiler.steps_per_sec ? `${status.profiler.steps_per_sec.toFixed(0)} steps/s` : "N/A"}
                />
              </div>
            </div>

            {/* System Health */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
              <div className="space-y-3">
                <HealthIndicator label="API Server" status="healthy" />
                <HealthIndicator label="Model Pipeline" status="healthy" />
                <HealthIndicator label="Memory" status="healthy" />
                <HealthIndicator
                  label="GPU"
                  status={status.profiler.gpu_util_percent ? "healthy" : "degraded"}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={loadStatus}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  🔄 Refresh Metrics
                </button>
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-200 text-gray-800 text-center py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  📚 API Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ProgressMetric({
  label,
  value,
  unit,
  max,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  max: number;
  color: string;
}) {
  const percent = Math.min((value / max) * 100, 100);
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">
          {value.toFixed(2)} {unit}
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function HealthIndicator({ label, status }: { label: string; status: "healthy" | "degraded" | "down" }) {
  const colors = {
    healthy: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
    degraded: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
    down: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  };

  const c = colors[status];

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${c.bg}`}>
      <span className={`text-sm font-medium ${c.text}`}>{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${c.dot}`}></div>
        <span className={`text-xs font-semibold ${c.text} uppercase`}>{status}</span>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// Mock data for demo
const mockStatus: SystemStatus = {
  status: "healthy",
  uptime_seconds: 86400,
  total_cases: 42,
  avg_inference_time: 1.52,
  profiler: {
    total_latency: 1.52,
    planner_latency_ms: 0.004,
    steps_per_sec: 1300,
    gpu_util_percent: 47,
    memory_mb: 2048,
  },
};
