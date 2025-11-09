"use client";

import { useEffect, useRef } from "react";
import { getCPMResults } from "@/lib/cpm";

export default function GanttChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { activitiesWithTimes, projectDuration } = getCPMResults();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chart dimensions
    const chartX = 150;
    const chartY = 50;
    const chartWidth = 900;
    const chartHeight = 400;
    const rowHeight = 50;

    // Draw title
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Diagram Gantt - Proyek Lini Produksi", canvas.width / 2, 30);

    // Draw time scale
    const timeScale = chartWidth / projectDuration;
    const timeInterval = 5; // Show every 5 hours

    ctx.fillStyle = "#475569";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";

    for (let t = 0; t <= projectDuration; t += timeInterval) {
      const x = chartX + t * timeScale;
      ctx.fillText(`${t}h`, x, chartY - 10);

      // Draw vertical grid line
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, chartY);
      ctx.lineTo(x, chartY + chartHeight);
      ctx.stroke();
    }

    // Draw activities
    const sortedActivities = activitiesWithTimes.sort((a, b) =>
      a.id.localeCompare(b.id)
    );

    sortedActivities.forEach((activity, index) => {
      const y = chartY + index * rowHeight + 10;

      // Draw activity label
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(activity.id, chartX - 20, y + 20);

      // Draw ES bar (Early Start)
      const esX = chartX + activity.es * timeScale;
      const barWidth = activity.duration * timeScale;

      // Draw bar
      ctx.fillStyle = activity.isCritical ? "#dc2626" : "#3b82f6";
      ctx.fillRect(esX, y, barWidth, 30);

      // Draw bar border
      ctx.strokeStyle = activity.isCritical ? "#991b1b" : "#1e40af";
      ctx.lineWidth = 2;
      ctx.strokeRect(esX, y, barWidth, 30);

      // Draw duration text on bar
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${activity.duration}h`, esX + barWidth / 2, y + 20);

      // Draw slack if non-critical
      if (!activity.isCritical && activity.slack > 0) {
        const slackX = esX + barWidth;
        const slackWidth = activity.slack * timeScale;

        // Draw slack bar (dashed)
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(slackX, y + 5, slackWidth, 20);
        ctx.setLineDash([]);

        // Draw slack text
        ctx.fillStyle = "#64748b";
        ctx.font = "10px sans-serif";
        ctx.fillText(
          `Slack: ${activity.slack.toFixed(1)}h`,
          slackX + slackWidth / 2,
          y + 17
        );
      }

      // Draw ES and EF markers
      ctx.fillStyle = "#475569";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`ES:${activity.es}`, esX, y - 5);
      ctx.fillText(`EF:${activity.ef}`, esX + barWidth, y - 5);
    });

    // Draw legend
    const legendY = chartY + chartHeight + 30;

    // Critical activity legend
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(chartX, legendY, 40, 20);
    ctx.strokeStyle = "#991b1b";
    ctx.lineWidth = 2;
    ctx.strokeRect(chartX, legendY, 40, 20);

    ctx.fillStyle = "#1e293b";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Aktivitas Kritis", chartX + 50, legendY + 15);

    // Non-critical activity legend
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(chartX + 250, legendY, 40, 20);
    ctx.strokeStyle = "#1e40af";
    ctx.lineWidth = 2;
    ctx.strokeRect(chartX + 250, legendY, 40, 20);

    ctx.fillStyle = "#1e293b";
    ctx.fillText("Aktivitas Non-Kritis", chartX + 300, legendY + 15);

    // Slack legend
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(chartX + 550, legendY + 5, 40, 10);
    ctx.setLineDash([]);

    ctx.fillStyle = "#1e293b";
    ctx.fillText("Slack Time", chartX + 600, legendY + 15);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        d) Diagram Gantt
      </h3>
      <p className="text-gray-600 mb-6 text-center max-w-2xl">
        Diagram Gantt menunjukkan jadwal pelaksanaan setiap aktivitas sepanjang
        waktu proyek. Bar merah menunjukkan aktivitas kritis, sedangkan bar biru
        menunjukkan aktivitas non-kritis dengan slack time (garis putus-putus).
      </p>
      <div className="bg-white rounded-lg shadow-lg p-4 overflow-x-auto">
        <canvas
          ref={canvasRef}
          width={1100}
          height={550}
          className="border border-gray-200 rounded"
        />
      </div>

      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl">
        <h4 className="font-semibold text-green-900 mb-2">
          Interpretasi Diagram Gantt:
        </h4>
        <ul className="text-sm text-green-800 space-y-2">
          <li>
            • <strong>Bar Solid:</strong> Menunjukkan durasi aktual aktivitas
          </li>
          <li>
            • <strong>Bar Putus-putus:</strong> Menunjukkan slack time (waktu
            kelonggaran) untuk aktivitas non-kritis
          </li>
          <li>
            • <strong>Aktivitas Kritis (Merah):</strong> Tidak memiliki slack time
            dan harus diselesaikan tepat waktu
          </li>
          <li>
            • <strong>Aktivitas Non-Kritis (Biru):</strong> Memiliki fleksibilitas
            waktu penyelesaian
          </li>
        </ul>
      </div>
    </div>
  );
}
