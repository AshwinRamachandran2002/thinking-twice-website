import React from "react";
import { rightIntegrationImages, AGENT_TO_FORT_ARROW_START_X_FRAC, AGENT_TO_FORT_ARROW_END_X_FRAC, CONTEXTFORT_BOX_WIDTH, CONTEXTFORT_BOX_HEIGHT } from "./FlowDiagram.constants";
import { FlowObject } from "./FlowDiagram.flowObjects";

// MiniContextFortSolutionDiagram: faithful mini version of FlowDiagram's Agent → ContextFort → Integrations (right)
export const MiniContextFortSolutionDiagram = () => {
  // SVG layout constants (compact, but proportional to FlowDiagram)
  const width = 340;
  const height = 140;
  // Agent and Fort box positions (proportional to FlowDiagram)
  const agentBox = { x: 50, y: 60, w: 48, h: 32 };
  const fortBox = { x: 130, y: 38, w: 80, h: 64 };
  // Right integrations (3 only)
  const iconCenters = [
    { x: 265, y: 50 },
    { x: 265, y: 80 },
    { x: 265, y: 110 },
  ];
  const iconR = 13;
  const icons = rightIntegrationImages.slice(0, 3);
  // Flow objects (reuse FlowDiagram's right arrows)
  const flowObjects = [
    new FlowObject({ label: "New Metric Post", color: "#0d9488", icon: icons[0], arrow: "right", t: 0.32 }),
    new FlowObject({ label: "Create Doc", color: "#0f766e", icon: icons[1], arrow: "right", t: 0.32 }),
    new FlowObject({ label: "Close Ticket", color: "#0f766e", icon: icons[2], arrow: "right", t: 0.32 }),
  ];
  // Helper: quadratic Bezier point
  function bezierPt(t, p0, cp, p2) {
    const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * cp.x + t * t * p2.x;
    const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * cp.y + t * t * p2.y;
    return { x, y };
  }
  // Helper: render a mini flow object (rectangle with icon and label)
  function MiniFlowObject({ obj, pt }) {
    return (
      <g>
        <rect x={pt.x - 26} y={pt.y - 12} width={52} height={24} rx={7} fill={obj.color} opacity="0.97" style={{filter:'drop-shadow(0 1.5px 4px rgba(0,0,0,0.13))'}} />
        <circle cx={pt.x - 14} cy={pt.y} r={8.5} fill="#fff" />
        <image href={obj.icon} x={pt.x - 21} y={pt.y - 7.5} width={17} height={17} />
        <text x={pt.x - 2} y={pt.y + 5} fontSize="10.5" fill="#fff" fontWeight="bold" style={{fontFamily:'Inter,sans-serif'}}>{obj.label}</text>
      </g>
    );
  }
  // Arrow control points (proportional, not hardcoded)
  const fortToIntCP = (y) => ({ x: fortBox.x + fortBox.w + 18, y });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <defs>
        <linearGradient id="fort-gradient" x1={fortBox.x} y1={fortBox.y} x2={fortBox.x + fortBox.w} y2={fortBox.y + fortBox.h} gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0fdfa" /> {/* teal-50 */}
          <stop offset="1" stopColor="#ccfbf1" /> {/* teal-100 */}
        </linearGradient>
        <marker id="arrow-fort" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L8,4 L0,8 L2,4 Z" fill="#0d9488" /> {/* teal-600 */}
        </marker>
      </defs>
      {/* Agent box */}
      <rect x={agentBox.x} y={agentBox.y} width={agentBox.w} height={agentBox.h} rx={10} fill="#f8fafc" stroke="#0d9488" strokeWidth="2" />
      <text x={agentBox.x + agentBox.w / 2} y={agentBox.y + agentBox.h / 2 + 4} textAnchor="middle" fontSize="13.5" fill="#334155" fontWeight="bold">Agent</text>
      {/* ContextFort box (gradient) */}
      <rect x={fortBox.x} y={fortBox.y} width={fortBox.w} height={fortBox.h} rx={15} fill="url(#fort-gradient)" stroke="#14b8a6" strokeWidth="2.2" />
      <text x={fortBox.x + fortBox.w / 2} y={fortBox.y + 25} textAnchor="middle" fontSize="14" fill="#0f172a" fontWeight="bold">ContextFort</text>
      {/* Agent to Fort arrow */}
      <path
        d={`M${agentBox.x + agentBox.w} ${agentBox.y + agentBox.h / 2} Q${agentBox.x + agentBox.w + 18} ${agentBox.y + agentBox.h / 2 - 30} ${fortBox.x} ${fortBox.y + fortBox.h / 2}`}
        stroke="#06b6d4"
        strokeWidth={2.2}
        fill="none"
        markerEnd="url(#arrow-fort)"
      />
      <text x={agentBox.x + agentBox.w + 24} y={agentBox.y + agentBox.h / 2 - 16} fontSize="10.5" fill="#06b6d4" fontWeight="bold">Tool Call</text>
      {/* Fort to Integrations arrows + flow objects */}
      {iconCenters.map((pt, i) => {
        const arrowId = `arrow-int${i}`;
        const start = { x: fortBox.x + fortBox.w, y: fortBox.y + 18 + i * 30 };
        const cp = fortToIntCP(pt.y);
        const end = { x: pt.x - iconR, y: pt.y };
        const obj = flowObjects[i];
        const objPt = bezierPt(obj.t, start, cp, end);
        return (
          <g key={i}>
            <defs>
              <marker id={arrowId} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L8,4 L0,8 L2,4 Z" fill="#38bdf8" />
              </marker>
            </defs>
            <path
              d={`M${start.x} ${start.y} Q${cp.x} ${cp.y} ${end.x} ${end.y}`}
              stroke="#38bdf8"
              strokeWidth={2}
              fill="none"
              markerEnd={`url(#${arrowId})`}
            />
            <MiniFlowObject obj={obj} pt={objPt} />
            <text x={fortBox.x + fortBox.w + 28} y={pt.y - 8} fontSize="9.5" fill="#38bdf8">API/DB</text>
          </g>
        );
      })}
      {/* Integration icons */}
      {icons.map((src, i) => (
        <g key={src}>
          <circle cx={iconCenters[i].x} cy={iconCenters[i].y} r={iconR} fill="#fff" stroke="#38bdf8" strokeWidth="2" />
          <image href={src} x={iconCenters[i].x - 10.5} y={iconCenters[i].y - 10.5} width={21} height={21} />
        </g>
      ))}
    </svg>
  );
};
