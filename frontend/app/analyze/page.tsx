"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeImage } from "@/lib/api";
import { AnalysisType, AnalysisResult } from "@/lib/types";
import Navbar from "@/components/clinical/Navbar";
import UploadForm from "@/components/clinical/UploadForm";
import ResultCard from "@/components/clinical/ResultCard";

/**
 * Analyze Page
 * Main interface for uploading and analyzing medical images
 * Workflow:
 * 1. User uploads image and selects analysis type
 * 2. Image is sent to backend for analysis
 * 3. Results are displayed with heatmap and trace
 * 4. User can navigate to detailed report
 */
export default function AnalyzePage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(type: AnalysisType, file: File) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeImage(type, file);
      setResult(analysisResult);
    } catch (err: any) {
      setError(err.message || "Analysis failed");
      console.error("Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Analysis</h1>
          <p className="text-gray-600 mt-1">
            Upload a medical image for AI-powered diagnostic analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upload Form */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Upload & Configure
              </h2>
              <UploadForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <span>ℹ️</span>
                Analysis Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Upload clear, high-quality medical images</li>
                <li>• Supported formats: JPEG, PNG, DICOM</li>
                <li>• Select appropriate analysis type for best results</li>
                <li>• Processing typically takes 1-3 seconds</li>
                <li>• All analysis performed locally (no cloud)</li>
              </ul>
            </div>
          </div>

          {/* Right: Results */}
          <div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">Analysis Failed</h3>
                    <p className="text-sm text-red-700">{error}</p>
                    <p className="text-xs text-red-600 mt-2">
                      Make sure the backend server is running on http://localhost:8000
                    </p>
                  </div>
                </div>
              </div>
            )}

            {result ? (
              <div className="space-y-6">
                <ResultCard result={result} />
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push(`/report/${result.case_id}`)}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View Full Report
                  </button>
                  <button
                    onClick={() => {
                      setResult(null);
                      setError(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    New Analysis
                  </button>
                </div>
              </div>
            ) : !isLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready for Analysis
                </h3>
                <p className="text-gray-600">
                  Upload an image to begin diagnostic analysis
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 border-8 border-blue-200 rounded-full"></div>
                  <div className="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Analyzing Image...
                </h3>
                <p className="text-gray-600 mb-4">
                  AI agents are processing your image
                </p>
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>Progress</span>
                    <span>Processing...</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
