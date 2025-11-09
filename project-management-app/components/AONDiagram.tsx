"use client";

import { useEffect, useRef } from "react";
import { getCPMResults } from "@/lib/cpm";

interface Node {
  id: string;
  x: number;
  y: number;
  es: number;
  ef: number;
  ls: number;
  lf: number;
  duration: number;
  isCritical: boolean;
}

export default function AONDiagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { activitiesWithTimes } = getCPMResults();

    // Define node positions for better layout
    const nodePositions: Record<string, { x: number; y: number }> = {
      A: { x: 150, y: 100 },
      B: { x: 150, y: 300 },
      C: { x: 350, y: 100 },
      D: { x: 550, y: 200 },
      E: { x: 550, y: 350 },
      F: { x: 750, y: 200 },
      G: { x: 950, y: 275 },
    };

    const nodes: Node[] = activitiesWithTimes.map((activity) => ({
      id: activity.id,
      x: nodePositions[activity.id].x,
      y: nodePositions[activity.id].y,
      es: activity.es,
      ef: activity.ef,
      ls: activity.ls,
      lf: activity.lf,
      duration: activity.duration,
      isCritical: activity.isCritical,
    }));

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges first (so they appear behind nodes)
    activitiesWithTimes.forEach((activity) => {
      const fromNode = nodes.find((n) => n.id === activity.id);
      if (!fromNode) return;

      activity.predecessors.forEach((predId) => {
        const toNode = nodes.find((n) => n.id === predId);
        if (!toNode) return;

        const isCriticalEdge = fromNode.isCritical && toNode.isCritical;

        ctx.beginPath();
        ctx.moveTo(toNode.x + 60, toNode.y + 40);
        ctx.lineTo(fromNode.x, fromNode.y + 40);

        ctx.strokeStyle = isCriticalEdge ? "#dc2626" : "#94a3b8";
        ctx.lineWidth = isCriticalEdge ? 3 : 2;
        ctx.stroke();

        // Draw arrow
        const angle = Math.atan2(
          fromNode.y + 40 - (toNode.y + 40),
          fromNode.x - (toNode.x + 60)
        );
        const arrowLength = 10;

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y + 40);
        ctx.lineTo(
          fromNode.x - arrowLength * Math.cos(angle - Math.PI / 6),
          fromNode.y + 40 - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(fromNode.x, fromNode.y + 40);
        ctx.lineTo(
          fromNode.x - arrowLength * Math.cos(angle + Math.PI / 6),
          fromNode.y + 40 - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      });
    });

    // Draw nodes
    nodes.forEach((node) => {
      const boxWidth = 120;
      const boxHeight = 80;

      // Draw box
      ctx.fillStyle = node.isCritical ? "#fee2e2" : "#f1f5f9";
      ctx.fillRect(node.x, node.y, boxWidth, boxHeight);

      // Draw border
      ctx.strokeStyle = node.isCritical ? "#dc2626" : "#475569";
      ctx.lineWidth = node.isCritical ? 3 : 2;
      ctx.strokeRect(node.x, node.y, boxWidth, boxHeight);

      // Draw internal lines
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1;

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(node.x, node.y + 25);
      ctx.lineTo(node.x + boxWidth, node.y + 25);
      ctx.stroke();

      // Vertical line in top section
      ctx.beginPath();
      ctx.moveTo(node.x + boxWidth / 2, node.y);
      ctx.lineTo(node.x + boxWidth / 2, node.y + 25);
      ctx.stroke();

      // Vertical line in bottom section
      ctx.beginPath();
      ctx.moveTo(node.x + boxWidth / 2, node.y + 25);
      ctx.lineTo(node.x + boxWidth / 2, node.y + boxHeight);
      ctx.stroke();

      // Draw text
      ctx.fillStyle = node.isCritical ? "#991b1b" : "#1e293b";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Activity ID (center top)
      ctx.fillText(node.id, node.x + boxWidth / 2, node.y + 12);

      // ES (top left)
      ctx.font = "12px sans-serif";
      ctx.fillText(`ES: ${node.es}`, node.x + boxWidth / 4, node.y + 40);

      // EF (top right)
      ctx.fillText(`EF: ${node.ef}`, node.x + (3 * boxWidth) / 4, node.y + 40);

      // LS (bottom left)
      ctx.fillText(`LS: ${node.ls}`, node.x + boxWidth / 4, node.y + 60);

      // LF (bottom right)
      ctx.fillText(`LF: ${node.lf}`, node.x + (3 * boxWidth) / 4, node.y + 60);
    });

    // Draw legend
    const legendY = 450;
    ctx.fillStyle = "#fee2e2";
    ctx.fillRect(50, legendY, 30, 20);
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 2;
    ctx.strokeRect(50, legendY, 30, 20);

    ctx.fillStyle = "#1e293b";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("= Aktivitas Kritis", 90, legendY + 15);

    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(250, legendY, 30, 20);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.strokeRect(250, legendY, 30, 20);

    ctx.fillStyle = "#1e293b";
    ctx.fillText("= Aktivitas Non-Kritis", 290, legendY + 15);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        a) Diagram AON (Activity on Node)
      </h3>
      <p className="text-gray-600 mb-6 text-center max-w-2xl">
        Diagram jaringan proyek menggunakan metode AON. Setiap kotak mewakili
        aktivitas dengan informasi ES (Early Start), EF (Early Finish), LS (Late
        Start), dan LF (Late Finish).
      </p>
      <div className="bg-white rounded-lg shadow-lg p-4 overflow-x-auto">
        <canvas
          ref={canvasRef}
          width={1150}
          height={500}
          className="border border-gray-200 rounded"
        />
      </div>
    </div>
  );
}
