"use client";

import { useState } from "react";

interface Finding {
  category: string;
  description: string;
  severity: "normal" | "abnormal" | "critical";
}

interface Analysis {
  impressions: string[];
  findings: Finding[];
  differential: string[];
  recommendations: string[];
}

const sampleAnalysis: Analysis = {
  impressions: [
    "Right lower lobe consolidation consistent with community-acquired pneumonia.",
    "No pleural effusion or pneumothorax.",
    "Cardiomediastinal silhouette within normal limits.",
  ],
  findings: [
    {
      category: "Pulmonary",
      description: "Focal consolidation in right lower lobe with air bronchograms. Left lung clear.",
      severity: "abnormal",
    },
    {
      category: "Cardiac",
      description: "Heart size within normal limits. No pericardial effusion.",
      severity: "normal",
    },
    {
      category: "Osseous",
      description: "No acute osseous abnormality.",
      severity: "normal",
    },
  ],
  differential: [
    "Bacterial pneumonia (most likely)",
    "Viral pneumonia",
    "Aspiration pneumonitis",
  ],
  recommendations: [
    "Clinical correlation recommended",
    "Follow-up imaging in 4-6 weeks",
  ],
};

export default function Assistant() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);

  const analyze = () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult(sampleAnalysis);
    }, 1800);
  };

  const clear = () => {
    setInput("");
    setResult(null);
  };

  return (
    <div className="h-screen flex flex-col bg-[#fafafa]">
      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-8 shrink-0">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-sm font-medium text-gray-900">Myndra</span>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-500">Assistant</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          System ready
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-[440px] bg-white border-r border-gray-200 flex flex-col">
          {/* Input Section */}
          <div className="p-6 border-b border-gray-100">
            <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-3">
              Clinical Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter clinical findings, patient history, or paste report..."
              className="w-full h-40 px-3 py-3 text-[13px] leading-relaxed bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#2D6AA6] focus:border-transparent resize-none placeholder:text-gray-400"
            />
          </div>

          {/* DICOM Placeholder */}
          <div className="flex-1 p-6 bg-gray-50">
            <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-3">
              Image Viewer
            </label>
            <div className="aspect-square bg-white border border-gray-200 rounded flex items-center justify-center">
              <div className="text-center">
                <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                  <path d="M3 9h18M9 21V9" strokeWidth="1.5" />
                </svg>
                <p className="text-xs text-gray-400">DICOM viewer</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <button
                onClick={clear}
                disabled={loading}
                className="flex-1 h-9 text-[13px] font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Clear
              </button>
              <button
                onClick={analyze}
                disabled={loading || !input.trim()}
                className="flex-1 h-9 text-[13px] font-medium text-white bg-[#2D6AA6] rounded hover:bg-[#265c94] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Processing..." : "Analyze"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 overflow-auto">
          {loading && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-7 h-7 mx-auto mb-3 border-2 border-gray-200 border-t-[#2D6AA6] rounded-full animate-spin" />
                <p className="text-[13px] text-gray-400">Analyzing findings...</p>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-xs">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-[13px] text-gray-500 mb-1">No analysis</p>
                <p className="text-xs text-gray-400">Enter clinical data to begin</p>
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="max-w-4xl mx-auto p-10">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-base font-medium text-gray-900 mb-1">Analysis Report</h1>
                <p className="text-xs text-gray-400">{new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>

              {/* Impressions */}
              <section className="mb-10">
                <h2 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-3">Impressions</h2>
                <div className="space-y-2">
                  {result.impressions.map((imp, i) => (
                    <div key={i} className="flex gap-3 text-[13px] leading-relaxed text-gray-700">
                      <span className="text-gray-400 font-medium shrink-0">{i + 1}.</span>
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Findings */}
              <section className="mb-10">
                <h2 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-3">Findings</h2>
                <div className="space-y-3">
                  {result.findings.map((f, i) => (
                    <div key={i} className="p-4 bg-white border border-gray-200 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">{f.category}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                          f.severity === 'critical' ? 'bg-red-50 text-red-700' :
                          f.severity === 'abnormal' ? 'bg-amber-50 text-amber-700' :
                          'bg-gray-50 text-gray-600'
                        }`}>
                          {f.severity}
                        </span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-gray-700">{f.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Differential */}
              <section className="mb-10">
                <h2 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-3">Differential Diagnosis</h2>
                <div className="p-4 bg-white border border-gray-200 rounded">
                  <ul className="space-y-2">
                    {result.differential.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-gray-700">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Recommendations */}
              <section className="mb-6">
                <h2 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-3">Recommendations</h2>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded">
                  <ul className="space-y-2">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-blue-900">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Image References */}
              <section>
                <h2 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-3">Image References</h2>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="aspect-square bg-white border border-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-300">Image {n}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
