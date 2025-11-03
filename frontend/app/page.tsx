"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCaseHistory } from "@/lib/api";
import { CaseHistory } from "@/lib/types";
import Navbar from "@/components/clinical/Navbar";

/**
 * Dashboard Page
 * Displays a table of all previous radiology analysis cases
 * Allows users to view detailed reports for each case
 */
export default function Dashboard() {
  const [cases, setCases] = useState<CaseHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    try {
      setLoading(true);
      const data = await getCaseHistory();
      // Sort by date, newest first
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setCases(data);
    } catch (err: any) {
      setError(err.message || "Failed to load case history");
      // Use mock data if backend not available
      setCases(mockCases);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Case Dashboard</h1>
              <p className="text-gray-600 mt-1">Review and manage radiology analyses</p>
            </div>
            <Link
              href="/analyze"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              + New Analysis
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Cases"
            value={cases.length}
            icon="📊"
            color="blue"
          />
          <StatCard
            label="Positive Findings"
            value={cases.filter(c => c.diagnosis !== "Normal").length}
            icon="⚠️"
            color="red"
          />
          <StatCard
            label="Normal Results"
            value={cases.filter(c => c.diagnosis === "Normal").length}
            icon="✅"
            color="green"
          />
          <StatCard
            label="Avg Confidence"
            value={`${Math.round(cases.reduce((sum, c) => sum + c.probability, 0) / (cases.length || 1) * 100)}%`}
            icon="📈"
            color="purple"
          />
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Recent Cases</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading cases...</p>
            </div>
          ) : error && cases.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-red-600 mb-2">⚠️ Backend not available</p>
              <p className="text-gray-500 text-sm">Showing sample data</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">No cases found</p>
              <Link
                href="/analyze"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first analysis →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Case ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diagnosis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cases.map((caseItem) => (
                    <tr key={caseItem.case_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {caseItem.case_id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {caseItem.patient_id || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                        {caseItem.analysis_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            caseItem.diagnosis === "Normal"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {caseItem.diagnosis}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {Math.round(caseItem.probability * 100)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {caseItem.agent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(caseItem.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link
                          href={`/report/${caseItem.case_id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Report →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
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
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`text-4xl ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Mock data for when backend is not available
const mockCases: CaseHistory[] = [
  {
    case_id: "case-001",
    patient_id: "P12345",
    analysis_type: "pneumonia",
    diagnosis: "Pneumonia",
    probability: 0.92,
    date: new Date().toISOString(),
    agent: "LungAgent",
  },
  {
    case_id: "case-002",
    patient_id: "P12346",
    analysis_type: "cardiomegaly",
    diagnosis: "Normal",
    probability: 0.08,
    date: new Date(Date.now() - 86400000).toISOString(),
    agent: "HeartAgent",
  },
  {
    case_id: "case-003",
    patient_id: "P12347",
    analysis_type: "heart",
    diagnosis: "Cardiomegaly",
    probability: 0.85,
    date: new Date(Date.now() - 172800000).toISOString(),
    agent: "HeartAgent",
  },
];
