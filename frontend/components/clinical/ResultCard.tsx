"use client";

import { useState } from "react";
import { AnalysisResult } from "@/lib/types";

interface ResultCardProps {
  result: AnalysisResult;
}

/**
 * Displays analysis results in a clean clinical card format
 * Features:
 * - Diagnosis with confidence percentage
 * - Visual confidence bar
 * - Agent information
 * - Inference time
 * - Expandable heatmap view
 * - Optional orchestrator trace
 */
export default function ResultCard({ result }: ResultCardProps) {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showTrace, setShowTrace] = useState(false);

  const confidencePercent = Math.round(result.probability * 100);
  const isAbnormal = result.diagnosis !== "Normal";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Analysis Result</h3>
            <p className="text-sm text-gray-600">Case ID: {result.case_id}</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
            isAbnormal 
              ? "bg-red-100 text-red-700" 
              : "bg-green-100 text-green-700"
          }`}>
            {result.diagnosis}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Confidence Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Confidence</p>
            <p className="text-3xl font-bold text-gray-900">{confidencePercent}%</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Agent</p>
            <p className="text-lg font-semibold text-gray-900">{result.agent}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Inference Time</p>
            <p className="text-lg font-semibold text-gray-900">
              {result.inference_time.toFixed(2)}s
            </p>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">Diagnostic Confidence</span>
            <span className="text-gray-900 font-bold">{confidencePercent}%</span>
          </div>
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                isAbnormal ? "bg-red-500" : "bg-green-500"
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {result.artifacts?.heatmap_png && (
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {showHeatmap ? "Hide" : "Show"} Heatmap
            </button>
          )}
          {result.trace && result.trace.length > 0 && (
            <button
              onClick={() => setShowTrace(!showTrace)}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              {showTrace ? "Hide" : "Show"} Trace
            </button>
          )}
        </div>

        {/* Heatmap Display */}
        {showHeatmap && result.artifacts?.heatmap_png && (
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Saliency Heatmap
            </h4>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <img
                src={result.artifacts.heatmap_png}
                alt="Diagnostic heatmap"
                className="w-full h-auto"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Red regions indicate areas of high diagnostic significance
            </p>
          </div>
        )}

        {/* Orchestrator Trace */}
        {showTrace && result.trace && (
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">
              Analysis Timeline
            </h4>
            <div className="space-y-3">
              {result.trace.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {step.step.charAt(0).toUpperCase() + step.step.slice(1)}
                      </span>
                      {step.agent && (
                        <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                          {step.agent}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{step.action}</p>
                    {step.output && (
                      <p className="text-xs text-gray-500 mt-1">
                        → {step.output}
                      </p>
                    )}
                    {step.confidence !== undefined && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${step.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {(step.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Log */}
        {result.artifacts?.log && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm font-medium text-yellow-800 mb-1">System Log</p>
            <p className="text-xs text-yellow-700 font-mono">{result.artifacts.log}</p>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-gray-500 text-center">
          Analysis completed: {new Date(result.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
