"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Activity, 
  Bell, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  User,
  FileText,
  TrendingUp,
  ArrowRight
} from "lucide-react";

interface Study {
  id: string;
  mrn: string;
  patient: string;
  modality: string;
  study: string;
  time: string;
  priority: "stat" | "urgent" | "routine";
  status: "pending" | "in-progress" | "complete";
  finding?: string;
}

const studies: Study[] = [
  {
    id: "1",
    mrn: "MRN-78234",
    patient: "Johnson, Michael A.",
    modality: "CXR",
    study: "Chest PA/Lateral",
    time: "14:32",
    priority: "stat",
    status: "pending",
    finding: "RLL consolidation",
  },
  {
    id: "2",
    mrn: "MRN-45123",
    patient: "Williams, Robert J.",
    modality: "CXR",
    study: "Chest Portable",
    time: "13:45",
    priority: "urgent",
    status: "pending",
    finding: "Cardiomegaly",
  },
  {
    id: "3",
    mrn: "MRN-92847",
    patient: "Davis, Karen L.",
    modality: "CT",
    study: "Head without contrast",
    time: "11:20",
    priority: "routine",
    status: "in-progress",
  },
  {
    id: "4",
    mrn: "MRN-33821",
    patient: "Brown, Thomas P.",
    modality: "CXR",
    study: "Chest single view",
    time: "10:15",
    priority: "routine",
    status: "complete",
  },
  {
    id: "5",
    mrn: "MRN-19283",
    patient: "Miller, Sarah K.",
    modality: "CXR",
    study: "Chest Portable",
    time: "09:40",
    priority: "routine",
    status: "pending",
  },
];

export default function Worklist() {
  const [filter, setFilter] = useState<"all" | "pending" | "findings">("pending");

  const filtered = studies
    .filter((s) => {
      if (filter === "pending") return s.status === "pending";
      if (filter === "findings") return s.finding;
      return true;
    })
    .sort((a, b) => {
      const p = { stat: 0, urgent: 1, routine: 2 };
      return p[a.priority] - p[b.priority];
    });

  const stats = {
    pending: studies.filter(s => s.status === "pending").length,
    inProgress: studies.filter(s => s.status === "in-progress").length,
    findings: studies.filter(s => s.finding).length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Clean Professional Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Myndra Health</h1>
                  <p className="text-xs text-slate-500">Radiology Worklist</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search patients or MRN..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm w-72"
                />
              </div>
              <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-700">System Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.pending}</span>
            </div>
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Pending</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.inProgress}</span>
            </div>
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">In Progress</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-md bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.findings}</span>
            </div>
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Findings</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-md bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{studies.length}</span>
            </div>
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total Today</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">Filter:</span>
              {["pending", "findings", "all"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filter === f
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <span className="text-sm text-slate-500">{filtered.length} studies</span>
          </div>
        </div>

        {/* Studies Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">MRN</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Study Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Findings</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold uppercase ${
                      s.priority === "stat" ? "bg-red-100 text-red-700" :
                      s.priority === "urgent" ? "bg-amber-100 text-amber-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {s.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{s.patient}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-600">{s.mrn}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">{s.modality}</div>
                        <div className="text-xs text-slate-500">{s.study}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Clock className="w-3.5 h-3.5" />
                      {s.time}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {s.finding ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-xs font-medium text-amber-700">{s.finding}</span>
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium uppercase ${
                      s.status === "complete" ? "bg-emerald-100 text-emerald-700" :
                      s.status === "in-progress" ? "bg-blue-100 text-blue-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {s.status === "complete" && <CheckCircle2 className="w-3 h-3" />}
                      {s.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/study/${s.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
