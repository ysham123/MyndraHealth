"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft,
  Save,
  X,
  User,
  Calendar,
  FileText,
  AlertCircle,
  Activity,
  Clock,
  CheckCircle2
} from "lucide-react";

const studyData: Record<string, any> = {
  "1": {
    patient: "Johnson, Michael A.",
    mrn: "MRN-78234",
    dob: "03/15/1958",
    study: "Chest PA/Lateral",
    date: "Dec 3, 2024 14:32",
    indication: "Cough, fever x3 days",
    finding: "RLL consolidation",
  },
  "2": {
    patient: "Williams, Robert J.",
    mrn: "MRN-45123",
    dob: "07/22/1965",
    study: "Chest Portable",
    date: "Dec 3, 2024 13:45",
    indication: "SOB, CHF follow-up",
    finding: "Cardiomegaly",
  },
};

export default function StudyViewer() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const data = studyData[id] || studyData["1"];

  const [report, setReport] = useState(
    `FINDINGS:\nThe lungs are clear bilaterally. No focal consolidation, pleural effusion, or pneumothorax.\n\nIMPRESSION:\n1. No acute cardiopulmonary abnormality.`
  );
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => router.push("/"), 800);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Clean Professional Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Myndra Health</h1>
                  <p className="text-xs text-slate-500">Study Viewer</p>
                </div>
              </Link>
              <Link href="/" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Worklist</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {data.finding && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-50 border border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">{data.finding}</span>
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-700">Session Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Viewer Section */}
        <div className="flex-1 p-6">
          <div className="h-full bg-white rounded-lg border border-slate-200 shadow-sm p-8 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-slate-100 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">DICOM Image Viewer</h3>
                <p className="text-sm text-slate-600 mb-3">{data.study}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-200 text-sm text-blue-700">
                  <Activity className="w-4 h-4" />
                  <span>Awaiting image data</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Panel */}
        <div className="w-[480px] p-6 pl-0">
          <div className="h-full flex flex-col gap-4">
            {/* Patient Information Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">Patient Information</h2>
                  <p className="text-xs text-slate-500">Demographics & Study Details</p>
                </div>
              </div>
              
              <div className="space-y-2.5">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-600">Name</span>
                  <span className="text-sm font-medium text-slate-900">{data.patient}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <span className="text-sm text-slate-600">MRN</span>
                  <span className="text-sm font-mono font-medium text-slate-900">{data.mrn}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <span className="text-sm text-slate-600">DOB</span>
                  <span className="text-sm font-medium text-slate-900">{data.dob}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <span className="text-sm text-slate-600">Study Type</span>
                  <span className="text-sm font-medium text-slate-900">{data.study}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <span className="text-sm text-slate-600">Study Date</span>
                  <span className="text-sm font-medium text-slate-900">{data.date}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700">Clinical Indication</span>
                </div>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">{data.indication}</p>
              </div>
            </div>

            {/* Report Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-slate-900">Radiology Report</h2>
              </div>
              <textarea
                value={report}
                onChange={(e) => setReport(e.target.value)}
                className="flex-1 px-3 py-3 text-sm leading-relaxed bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
                placeholder="Enter findings and impressions..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/")}
                disabled={saved}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saved}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
                  saved
                    ? "bg-emerald-600 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Sign Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
