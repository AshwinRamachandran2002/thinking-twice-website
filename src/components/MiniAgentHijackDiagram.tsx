import React from "react";
import { leftIntegrationImages, rightIntegrationImages } from "./FlowDiagram.constants";

// MiniAgentInflowDiagram: a simplified, static SVG version of the left side of FlowDiagram
export const MiniAgentInflowDiagram = () => {
  const width = 220;
  const height = 120;
  const agentBox = { x: 40, y: 45, w: 50, h: 30 };
  const iconCenters = [
    { x: 150, y: 35 },
    { x: 150, y: 60 },
    { x: 150, y: 85 },
  ];
  const iconR = 13;
  // Use leftIntegrationImages for icons
  const icons = leftIntegrationImages.slice(0, 3);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      {/* Agent box */}
      <rect x={agentBox.x} y={agentBox.y} width={agentBox.w} height={agentBox.h} rx={10} fill="#334155" stroke="#f87171" strokeWidth="2" />
      <text x={agentBox.x + agentBox.w / 2} y={agentBox.y + agentBox.h / 2 + 4} textAnchor="middle" fontSize="14" fill="#fff" fontWeight="bold">Agent</text>
      {/* Curved arrows (injection) */}
      {iconCenters.map((pt, i) => {
        const color = "#fbbf24";
        const arrowId = `inarrow${i}`;
        // Quadratic curve control point
        const cpx = (pt.x + agentBox.x) / 2 - 10;
        const cpy = pt.y - 18;
        return (
          <g key={i}>
            <defs>
              <marker id={arrowId} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L8,4 L0,8 L2,4 Z" fill={color} />
              </marker>
            </defs>
            <path
              d={`M${agentBox.x} ${agentBox.y + agentBox.h / 2} Q${cpx} ${cpy} ${pt.x + iconR} ${pt.y}`}
              stroke={color}
              strokeWidth={2.5}
              fill="none"
              markerEnd={`url(#${arrowId})`}
            />
          </g>
        );
      })}
      {/* Integration icons */}
      {icons.map((src, i) => (
        <g key={src}>
          <circle cx={iconCenters[i].x} cy={iconCenters[i].y} r={iconR} fill="#fff" stroke="#38bdf8" strokeWidth="2" />
          <image href={src} x={iconCenters[i].x - 10} y={iconCenters[i].y - 10} width={20} height={20} />
        </g>
      ))}
      {/* Labels */}
      <text x={width / 2 + 10} y={height - 8} textAnchor="middle" fontSize="11" fill="#fbbf24">Injected Commands</text>
    </svg>
  );
};

// MiniAgentHijackDiagram: shows the agent being hijacked (prompt injection)
export const MiniAgentHijackDiagram = () => {
  const width = 120;
  const height = 120;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      {/* Agent box */}
      <rect x={45} y={45} width={30} height={30} rx={10} fill="#334155" stroke="#f87171" strokeWidth="2" />
      <text x={60} y={63} textAnchor="middle" fontSize="14" fill="#fff" fontWeight="bold">Agent</text>
      {/* Hijack effect: red dashed circle */}
      <circle cx={60} cy={60} r={22} fill="none" stroke="#f87171" strokeDasharray="4 3" strokeWidth="2.5" />
      {/* Devil/alert icon (prompt injection) */}
      <g>
        <circle cx={60} cy={32} r={10} fill="#f87171" opacity="0.85" />
        <text x={60} y={37} textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold" style={{fontFamily:'monospace'}}>!</text>
      </g>
      {/* Labels */}
      <text x={60} y={110} textAnchor="middle" fontSize="11" fill="#f87171">Agent Hijacked</text>
      <text x={60} y={102} textAnchor="middle" fontSize="10" fill="#fbbf24">(Prompt Injection)</text>
    </svg>
  );
};

// MiniAgentOutflowDiagram: shows agent sending malicious actions to integrations
export const MiniAgentOutflowDiagram = () => {
  const width = 220;
  const height = 120;
  const agentBox = { x: 40, y: 45, w: 50, h: 30 };
  const iconCenters = [
    { x: 150, y: 35 },
    { x: 150, y: 60 },
    { x: 150, y: 85 },
  ];
  const iconR = 13;
  // Use rightIntegrationImages for icons
  const icons = rightIntegrationImages.slice(0, 3);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      {/* Agent box */}
      <rect x={agentBox.x} y={agentBox.y} width={agentBox.w} height={agentBox.h} rx={10} fill="#334155" stroke="#f87171" strokeWidth="2" />
      <text x={agentBox.x + agentBox.w / 2} y={agentBox.y + agentBox.h / 2 + 4} textAnchor="middle" fontSize="14" fill="#fff" fontWeight="bold">Agent</text>
      {/* Curved arrows (malicious) */}
      {iconCenters.map((pt, i) => {
        const color = "#f87171";
        const arrowId = `outarrow${i}`;
        // Quadratic curve control point
        const cpx = (pt.x + agentBox.x + agentBox.w) / 2 + 10;
        const cpy = pt.y - 18;
        return (
          <g key={i}>
            <defs>
              <marker id={arrowId} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L8,4 L0,8 L2,4 Z" fill={color} />
              </marker>
            </defs>
            <path
              d={`M${agentBox.x + agentBox.w} ${agentBox.y + agentBox.h / 2} Q${cpx} ${cpy} ${pt.x - iconR} ${pt.y}`}
              stroke={color}
              strokeWidth={2.5}
              fill="none"
              markerEnd={`url(#${arrowId})`}
            />
          </g>
        );
      })}
      {/* Integration icons */}
      {icons.map((src, i) => (
        <g key={src}>
          <circle cx={iconCenters[i].x} cy={iconCenters[i].y} r={iconR} fill="#fff" stroke="#38bdf8" strokeWidth="2" />
          <image href={src} x={iconCenters[i].x - 10} y={iconCenters[i].y - 10} width={20} height={20} />
        </g>
      ))}
      {/* Labels */}
      <text x={width / 2 + 10} y={height - 8} textAnchor="middle" fontSize="11" fill="#f87171">Malicious Actions</text>
    </svg>
  );
};
