import React from "react";
import jiraLogo from '../assets/jira.svg';
import zendeskLogo from '../assets/zendesk.svg';
import slackLogo from '../assets/slack.svg';

// MiniContextFortSolutionDiagram: faithful mini version of FlowDiagram's Agent → ContextFort → Integrations (right)
export const MiniContextFortSolutionDiagram = () => {
  // SVG layout constants (compact, but proportional to FlowDiagram)
  const width = 600;
  const height = 200;
  // Agent and Fort box positions (proportional to FlowDiagram)
  const agentBox = { x: 10, y: 60, w: 120, h: 90 };
  const fortBox = { x: 220, y: 30, w: 200, h: 130 };
  // Integration positions
  const integrations = [
    { x: 500, y: 40, icon: jiraLogo, label: "Jira" },
    { x: 500, y: 80, icon: zendeskLogo, label: "Zendesk" },
    { x: 500, y: 120, icon: slackLogo, label: "Slack" }
  ];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" className="max-w-full">
      <defs>
        <linearGradient id="fort-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#f0fdfa" offset="0%" />
          <stop stopColor="#ccfbf1" offset="100%" />
        </linearGradient>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 L2,5 Z" fill="#ffa62b" />
        </marker>
      </defs>

      {/* Agent Box */}
      <rect 
        x={agentBox.x} 
        y={agentBox.y} 
        width={agentBox.w} 
        height={agentBox.h} 
        rx={10} 
        fill="#fff"
        stroke="#ffa62b"
        strokeWidth="2"
      />
      <text 
        x={agentBox.x + agentBox.w/2} 
        y={agentBox.y + agentBox.h/2 + 5} 
        textAnchor="middle" 
        fontSize="14"
        fontWeight="bold"
        fill="#334155"
      >
        AI Agent
      </text>

      {/* ContextFort Box */}
      <rect 
        x={fortBox.x} 
        y={fortBox.y} 
        width={fortBox.w} 
        height={fortBox.h} 
        rx={15}
        fill="url(#fort-gradient)"
        stroke="#ffa62b"
        strokeWidth="2.5"
      />
      <text 
        x={fortBox.x + fortBox.w/2} 
        y={fortBox.y + fortBox.h/2 + 5} 
        textAnchor="middle" 
        fontSize="16"
        fontWeight="bold"
        fill="#334155"
      >
        ContextFort
      </text>

      {/* Agent to Fort Arrow */}
      <path
        d={`M${agentBox.x + agentBox.w} ${agentBox.y + agentBox.h/2} H${fortBox.x}`}
        stroke="#ffa62b"
        strokeWidth="2"
        markerEnd="url(#arrow)"
      />
      <text 
        x={agentBox.x + agentBox.w + 20} 
        y={agentBox.y + agentBox.h/2 - 8}
        fontSize="12"
        fill="#64748b"
        fontWeight="medium"
      >
        Tool Calls
      </text>

      {/* Integration Icons and Arrows */}
      {integrations.map((int, i) => (
        <g key={int.label}>
          {/* Arrow to integration */}
          <path
            d={`M${fortBox.x + fortBox.w} ${fortBox.y + 35 + i * 30} H${int.x - 25}`}
            stroke="#ffa62b"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          
          {/* Integration circle and icon */}
          <circle
            cx={int.x}
            cy={int.y}
            r={15}
            fill="#fff"
            stroke="#ffa62b"
            strokeWidth="2"
          />
          <image
            href={int.icon}
            x={int.x - 10}
            y={int.y - 10}
            width="20"
            height="20"
          />
          
          {/* Integration label */}
          <text
            x={int.x + 25}
            y={int.y + 5}
            fontSize="12"
            fill="#64748b"
            fontWeight="medium"
          >
            {int.label}
          </text>
        </g>
      ))}
    </svg>
  );
};
