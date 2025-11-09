"use client";

import { useState } from "react";
import AONDiagram from "@/components/AONDiagram";
import GanttChart from "@/components/GanttChart";
import CriticalPathAnalysis from "@/components/CriticalPathAnalysis";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"aon" | "gantt" | "analysis">("aon");

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Analisis Proyek Lini Produksi
          </h1>
          <h2 className="text-2xl text-indigo-600 mb-4">
            Pabrik Sepatu Lavayelle
          </h2>
          <p className="text-gray-600 mb-6">
            Analisis jaringan proyek menggunakan metode Critical Path Method (CPM)
          </p>

          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("aon")}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === "aon"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              a) Diagram AON
            </button>
            <button
              onClick={() => setActiveTab("analysis")}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === "analysis"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              b & c) Jalur Kritis & Durasi
            </button>
            <button
              onClick={() => setActiveTab("gantt")}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === "gantt"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              d) Diagram Gantt
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            {activeTab === "aon" && <AONDiagram />}
            {activeTab === "analysis" && <CriticalPathAnalysis />}
            {activeTab === "gantt" && <GanttChart />}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Data Aktivitas Proyek
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="px-4 py-3 font-semibold">Aktivitas</th>
                  <th className="px-4 py-3 font-semibold">Waktu (jam)</th>
                  <th className="px-4 py-3 font-semibold">Pendahulu Langsung</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { activity: "A", time: 6, predecessors: "-" },
                  { activity: "B", time: 7.2, predecessors: "-" },
                  { activity: "C", time: 5, predecessors: "A" },
                  { activity: "D", time: 6, predecessors: "B, C" },
                  { activity: "E", time: 4.5, predecessors: "B, C" },
                  { activity: "F", time: 7.7, predecessors: "D" },
                  { activity: "G", time: 4, predecessors: "E, F" },
                ].map((row, idx) => (
                  <tr
                    key={row.activity}
                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-3 font-semibold text-indigo-600">
                      {row.activity}
                    </td>
                    <td className="px-4 py-3">{row.time}</td>
                    <td className="px-4 py-3">{row.predecessors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
