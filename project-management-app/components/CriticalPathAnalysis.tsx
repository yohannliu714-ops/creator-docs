"use client";

import { getCPMResults } from "@/lib/cpm";

export default function CriticalPathAnalysis() {
  const { activitiesWithTimes, criticalPath, projectDuration } = getCPMResults();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          b) Jalur Kritis (Critical Path)
        </h3>
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-600 p-6 rounded-lg">
          <p className="text-gray-700 mb-3">
            Jalur kritis adalah jalur terpanjang dalam jaringan proyek yang
            menentukan durasi minimum proyek. Aktivitas pada jalur kritis memiliki
            slack time = 0.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold text-gray-700">
              Jalur Kritis:
            </span>
            <div className="flex items-center gap-2">
              {criticalPath.map((activity, index) => (
                <div key={activity} className="flex items-center">
                  <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                    {activity}
                  </span>
                  {index < criticalPath.length - 1 && (
                    <span className="mx-2 text-red-600 font-bold text-xl">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          c) Perkiraan Penyelesaian Proyek
        </h3>
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-l-4 border-indigo-600 p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold text-gray-700">
              Durasi Proyek:
            </span>
            <span className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-2xl">
              {projectDuration} jam
            </span>
          </div>
          <p className="text-gray-700 mt-4">
            Waktu minimum yang diperlukan untuk menyelesaikan seluruh proyek
            pembuatan lini produksi adalah <strong>{projectDuration} jam</strong>.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Tabel Analisis Lengkap
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="px-4 py-3 text-left font-semibold">Aktivitas</th>
                <th className="px-4 py-3 text-center font-semibold">Durasi</th>
                <th className="px-4 py-3 text-center font-semibold">ES</th>
                <th className="px-4 py-3 text-center font-semibold">EF</th>
                <th className="px-4 py-3 text-center font-semibold">LS</th>
                <th className="px-4 py-3 text-center font-semibold">LF</th>
                <th className="px-4 py-3 text-center font-semibold">Slack</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {activitiesWithTimes
                .sort((a, b) => a.id.localeCompare(b.id))
                .map((activity, idx) => (
                  <tr
                    key={activity.id}
                    className={`${
                      activity.isCritical
                        ? "bg-red-50 font-semibold"
                        : idx % 2 === 0
                        ? "bg-gray-50"
                        : "bg-white"
                    } hover:bg-indigo-50 transition-colors`}
                  >
                    <td className="px-4 py-3 text-left">
                      <span
                        className={`font-bold ${
                          activity.isCritical ? "text-red-600" : "text-indigo-600"
                        }`}
                      >
                        {activity.id}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{activity.duration}</td>
                    <td className="px-4 py-3 text-center">{activity.es}</td>
                    <td className="px-4 py-3 text-center">{activity.ef}</td>
                    <td className="px-4 py-3 text-center">{activity.ls}</td>
                    <td className="px-4 py-3 text-center">{activity.lf}</td>
                    <td className="px-4 py-3 text-center">
                      {activity.slack.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {activity.isCritical ? (
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Kritis
                        </span>
                      ) : (
                        <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-sm">
                          Non-Kritis
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Keterangan:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              <strong>ES (Early Start):</strong> Waktu paling awal aktivitas dapat
              dimulai
            </li>
            <li>
              <strong>EF (Early Finish):</strong> Waktu paling awal aktivitas dapat
              selesai
            </li>
            <li>
              <strong>LS (Late Start):</strong> Waktu paling lambat aktivitas dapat
              dimulai tanpa menunda proyek
            </li>
            <li>
              <strong>LF (Late Finish):</strong> Waktu paling lambat aktivitas dapat
              selesai tanpa menunda proyek
            </li>
            <li>
              <strong>Slack:</strong> Waktu kelonggaran (LS - ES atau LF - EF)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
