"use client";

import { useState } from "react";
import { AnalysisResult } from "@/lib/types";

interface ResultCardProps {
  result: AnalysisResult;
}

/**
 * Professional Radiology Reading Interface
 * Simulates a PACS workstation environment
 */
export default function ResultCard({ result }: ResultCardProps) {
  const [viewMode, setViewMode] = useState<'original' | 'heatmap'>('heatmap');
  
  const confidencePercent = result.probability ? Math.round(result.probability * 100) : 0;
  const isAbnormal = result.diagnosis !== "Normal";
  
  // Generate simulated report text based on findings
  const reportText = isAbnormal 
    ? `Findings consistent with ${result.diagnosis.toLowerCase()}. AI analysis indicates ${confidencePercent}% probability of pathology in the highlighted regions.`
    : "No acute cardiopulmonary abnormality detected. Clear lung fields and normal cardiac silhouette.";

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col lg:flex-row min-h-[600px]">
      {/* Left: Image Viewer (Dark Mode for Reading) */}
      <div className="flex-1 bg-black relative flex items-center justify-center p-4">
        <div className="relative max-w-full max-h-full">
          {/* Base Image / Heatmap */}
          {result.artifacts?.heatmap_png && viewMode === 'heatmap' ? (
            <img 
              src={result.artifacts.heatmap_png} 
              alt="AI Analysis Heatmap"
              className="max-h-[600px] object-contain"
            />
          ) : (
            <div className="text-gray-500 flex flex-col items-center">
              {/* Fallback if original image URL isn't passed, usually we'd show the original here */}
              <p>Original Image View</p>
              <p className="text-xs mt-2">(Toggle 'AI Overlay' to view analysis)</p>
            </div>
          )}
          
          {/* Viewer Controls Overlay */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800/90 rounded-full px-4 py-2 flex gap-4 backdrop-blur-sm border border-slate-600">
            <button 
              onClick={() => setViewMode('original')}
              className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${viewMode === 'original' ? 'bg-white text-black' : 'text-white hover:bg-slate-700'}`}
            >
              Original
            </button>
            <button 
              onClick={() => setViewMode('heatmap')}
              className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${viewMode === 'heatmap' ? 'bg-blue-500 text-white' : 'text-white hover:bg-slate-700'}`}
            >
              AI Overlay
            </button>
          </div>
        </div>
      </div>

      {/* Right: Findings & Report (Clinical UI) */}
      <div className="w-full lg:w-[400px] bg-slate-50 border-l border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-900">AI Findings</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${isAbnormal ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {result.diagnosis}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Confidence:</span>
            <div className="flex-1 h-2 w-24 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${isAbnormal ? 'bg-red-500' : 'bg-green-500'}`} 
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
            <span className="font-mono font-medium text-slate-700">{confidencePercent}%</span>
          </div>
        </div>

        {/* Draft Report Section */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Draft Report (Preliminary)
          </h3>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-800 leading-relaxed font-serif">
              {reportText}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Suggested Actions
            </h3>
            <ul className="space-y-2">
              {isAbnormal ? (
                <>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-orange-500">⚠️</span> Verify heatmap localization
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-blue-500">ℹ️</span> Correlate with clinical history
                  </li>
                </>
              ) : (
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="text-green-500">✓</span> Mark as Normal
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-100">
          <div className="grid grid-cols-2 gap-3">
            <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
              Edit Report
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
              Finalize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
