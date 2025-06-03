import React from "react";
import {
  leftIntegrationImages,
} from "./FlowDiagram.constants";

// MiniAgentInflowDiagram: a simplified, static SVG version of the left side of FlowDiagram
export const MiniAgentInflowDiagram = () => {
  // Use 3 integrations for compactness
  const icons = leftIntegrationImages.slice(0, 3);
  // SVG layout constants
  const width = 220;
  const height = 120;
  const agentBox = { x: 150, y: 45, w: 50, h: 30 };
  const iconCenters = [
    { x: 35, y: 35 },
    { x: 35, y: 60 },
    { x: 35, y: 85 },
  ];
  const iconR = 13;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      {/* Integration icons */}
      {icons.map((src, i) => (
        <g key={src}>
          <circle cx={iconCenters[i].x} cy={iconCenters[i].y} r={iconR} fill="#fff" stroke="#38bdf8" strokeWidth="2" />
          <image href={src} x={iconCenters[i].x - 10} y={iconCenters[i].y - 10} width={20} height={20} />
        </g>
      ))}
      {/* Curved arrows (last one is malicious) */}
      {iconCenters.map((pt, i) => {
        const isMalicious = i === 2;
        const color = isMalicious ? "#f87171" : "#06b6d4";
        const arrowId = `arrowhead${i}`;
        // Quadratic curve control point
        const cpx = (pt.x + agentBox.x) / 2 + 10;
        const cpy = pt.y - 18;
        return (
          <g key={i}>
            <defs>
              <marker id={arrowId} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L8,4 L0,8 L2,4 Z" fill={color} />
              </marker>
            </defs>
            <path
              d={`M${pt.x + iconR} ${pt.y} Q${cpx} ${cpy} ${agentBox.x} ${agentBox.y + agentBox.h / 2}`}
              stroke={color}
              strokeWidth={isMalicious ? 2.5 : 2}
              fill="none"
              markerEnd={`url(#${arrowId})`}
              style={isMalicious ? { filter: "drop-shadow(0 0 4px #f87171)" } : {}}
            />
          </g>
        );
      })}
      {/* Agent box */}
      <rect x={agentBox.x} y={agentBox.y} width={agentBox.w} height={agentBox.h} rx={10} fill="#334155" stroke="#f87171" strokeWidth="2" />
      <text x={agentBox.x + agentBox.w / 2} y={agentBox.y + agentBox.h / 2 + 4} textAnchor="middle" fontSize="14" fill="#fff" fontWeight="bold">Agent</text>
      {/* Malicious context label */}
      <text x={width / 2 + 10} y={height - 8} textAnchor="middle" fontSize="11" fill="#f87171">Malicious Context</text>
    </svg>
  );
};
