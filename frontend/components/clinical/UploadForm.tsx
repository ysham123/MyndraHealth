"use client";

import { useState } from "react";
import { AnalysisType } from "@/lib/types";

interface UploadFormProps {
  onSubmit: (type: AnalysisType, file: File) => Promise<void>;
  isLoading: boolean;
}

/**
 * Upload form component for medical image analysis
 * Features:
 * - Drag-and-drop file upload
 * - Analysis type selection (Pneumonia, Heart, Cardiomegaly)
 * - Image preview
 * - Progress indication during analysis
 */
export default function UploadForm({ onSubmit, isLoading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>("pneumonia");
  const [isDragging, setIsDragging] = useState(false);

  function handleFileSelect(selectedFile: File | null) {
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      handleFileSelect(droppedFile);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (file) {
      await onSubmit(analysisType, file);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Analysis Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Analysis Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "pneumonia" as AnalysisType, label: "Pneumonia", icon: "🫁" },
            { value: "cardiomegaly" as AnalysisType, label: "Cardiomegaly", icon: "❤️" },
            { value: "heart" as AnalysisType, label: "Heart Disease", icon: "🩺" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setAnalysisType(option.value)}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                analysisType === option.value
                  ? "border-blue-600 bg-blue-50 text-blue-900"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className="text-sm font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* File Upload Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Upload Medical Image
        </label>
        
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          {!preview ? (
            <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-lg font-medium text-gray-700 mb-1">
                Drop image here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                JPEG, PNG, or DICOM (Max 10MB)
              </p>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-80 object-contain rounded-xl"
              />
              <button
                type="button"
                onClick={() => handleFileSelect(null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {file && (
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-medium">File:</span> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!file || isLoading}
        className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Image...
          </span>
        ) : (
          "Run Analysis"
        )}
      </button>
    </form>
  );
}
