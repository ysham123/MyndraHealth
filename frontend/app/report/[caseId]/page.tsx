"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getReport } from "@/lib/api";
import { DetailedReport } from "@/lib/types";
import Navbar from "@/components/clinical/Navbar";

/**
 * Report Detail Page
 * Displays comprehensive analysis report for a specific case
 * Includes:
 * - Diagnosis and confidence metrics
 * - Heatmap visualization
 * - Complete orchestrator trace
 * - System profiler metrics
 */
export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;

  const [report, setReport] = useState<DetailedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (caseId) {
      loadReport();
    }
  }, [caseId]);

  async function loadReport() {
    try {
      setLoading(true);
      const data = await getReport(caseId);
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Failed to load report");
      // Use mock data for demo
      setReport(mockReport);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 inline-block">
            <p className="text-red-600 mb-4">⚠️ {error}</p>
            <button
              onClick={() => router.push("/")}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const confidencePercent = Math.round(report.probability * 100);
  const isAbnormal = report.diagnosis !== "Normal";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Case Report</h1>
              <p className="text-gray-600 mt-1">ID: {report.case_id}</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Diagnosis</p>
            <p className={`text-2xl font-bold ${isAbnormal ? "text-red-600" : "text-green-600"}`}>
              {report.diagnosis}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Confidence</p>
            <p className="text-2xl font-bold text-gray-900">{confidencePercent}%</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Agent</p>
            <p className="text-xl font-semibold text-gray-900">{report.agent}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Inference Time</p>
            <p className="text-2xl font-bold text-gray-900">{report.inference_time.toFixed(2)}s</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Heatmap */}
            {report.artifacts?.heatmap_png && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Diagnostic Heatmap
                </h2>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={report.artifacts.heatmap_png}
                    alt="Diagnostic heatmap"
                    className="w-full h-auto"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  Saliency map highlighting regions of diagnostic significance. Red/yellow areas
                  indicate high model attention.
                </p>
              </div>
            )}

            {/* Orchestrator Trace */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Analysis Timeline
              </h2>
              <div className="space-y-4">
                {report.orchestrator_trace.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900 uppercase">
                          {step.step}
                        </span>
                        {step.agent && (
                          <span className="text-xs text-gray-600 bg-white px-3 py-1 rounded-full">
                            {step.agent}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{step.action}</p>
                      {step.output && (
                        <p className="text-xs text-gray-600 bg-white rounded p-2 mt-2">
                          → {step.output}
                        </p>
                      )}
                      {step.confidence !== undefined && (
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600"
                              style={{ width: `${step.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            {(step.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Case Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Details</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Case ID</p>
                  <p className="font-mono text-gray-900">{report.case_id}</p>
                </div>
                {report.patient_id && (
                  <div>
                    <p className="text-gray-600">Patient ID</p>
                    <p className="font-semibold text-gray-900">{report.patient_id}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Analysis Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{report.analysis_type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Timestamp</p>
                  <p className="text-gray-900">{new Date(report.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* System Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Metrics</h2>
              <div className="space-y-4">
                <MetricRow
                  label="Total Latency"
                  value={`${report.profiler_metrics.total_latency.toFixed(3)}s`}
                />
                <MetricRow
                  label="Planner Latency"
                  value={`${report.profiler_metrics.planner_latency_ms.toFixed(2)}ms`}
                />
                {report.profiler_metrics.steps_per_sec && (
                  <MetricRow
                    label="Steps/Second"
                    value={report.profiler_metrics.steps_per_sec.toFixed(0)}
                  />
                )}
                {report.profiler_metrics.gpu_util_percent !== undefined && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">GPU Utilization</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {report.profiler_metrics.gpu_util_percent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${report.profiler_metrics.gpu_util_percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/analyze"
                  className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  New Analysis
                </Link>
                <Link
                  href="/"
                  className="block w-full bg-white text-blue-600 text-center py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-blue-200"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

// Mock data for demo
const mockReport: DetailedReport = {
  case_id: "case-demo-001",
  patient_id: "P12345",
  analysis_type: "pneumonia",
  diagnosis: "Pneumonia",
  probability: 0.92,
  agent: "LungAgent",
  inference_time: 1.52,
  timestamp: new Date().toISOString(),
  artifacts: {
    heatmap_png: "/placeholder.png",
  },
  orchestrator_trace: [
    {
      step: "plan",
      action: "Decompose chest X-ray analysis task",
      confidence: 0.95,
    },
    {
      step: "assign",
      agent: "LungAgent",
      action: "Assigned pneumonia detection to LungAgent",
      confidence: 0.98,
    },
    {
      step: "execute",
      agent: "LungAgent",
      action: "Analyzing lung regions for pneumonia indicators",
      output: "Pneumonia detected with 92% confidence",
    },
    {
      step: "adapt",
      action: "Retaining assignment based on high confidence",
    },
  ],
  profiler_metrics: {
    total_latency: 1.52,
    planner_latency_ms: 0.004,
    steps_per_sec: 1300,
    gpu_util_percent: 47,
  },
};
