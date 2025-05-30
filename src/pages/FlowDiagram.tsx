import React, { useEffect, useRef, useState } from 'react';

const agentPos = { x: 460, y: 150 };
const integrationContextPos = { x: 90, y: 50 };
const integrationActionPos = { x: 90, y: 250 };
const userPos = { x: 460, y: 20 };
const llmPos = { x: 680, y: 150 };

const getMidpoint = (from, to, bend) => {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 + (bend === 'up' ? -80 : bend === 'down' ? 80 : 0);
  return { x: midX, y: midY };
};

const getQuadraticBezierPoint = (t, p0, p1, p2) => {
  const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
  const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
  return { x, y };
};

const getRandomColor = () => (Math.random() > 0.5 ? '#22c55e' : '#ef4444');

const FlowDot = ({ from, to, bend, label, type, cloudPosition, cloudSet, delay = 0 }) => {
  const [t, setT] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showCloud, setShowCloud] = useState(false);
  const [color, setColor] = useState(getRandomColor());
  const mid = getMidpoint(from, to, bend);
  const duration = 4000;
  const speed = 1 / (duration / 16);
  const opacity = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;

  useEffect(() => {
    let frameId;
    let started = false;

    const loop = () => {
      if (!started) return;
      if (!paused) {
        setT(prev => {
          const nextT = prev + speed;
          if (Math.abs(nextT - 0.5) < speed / 1.5) {
            setPaused(true);
            setShowCloud(true);
            setTimeout(() => {
              setShowCloud(false);
              setTimeout(() => setPaused(false), 100);
            }, 2000);
          }
          if (nextT >= 1) {
            setPaused(true);
            setTimeout(() => {
              setColor(getRandomColor());
              setT(0);
              setPaused(false);
            }, 1000);
            return prev;
          }
          return nextT;
        });
      }
      frameId = requestAnimationFrame(loop);
    };

    const start = () => {
      started = true;
      loop();
    };

    const timeoutId = setTimeout(start, delay);
    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(frameId);
    };
  }, [paused, delay]);

  const { x, y } = getQuadraticBezierPoint(t, from, mid, to);

  return (
    <>
      <div
        className="absolute text-xs font-bold pointer-events-none"
        style={{
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)',
          color,
          opacity,
          boxShadow: '0 0 8px rgba(0,0,0,0.3)',
        }}
      >
        {label}
      </div>
      {showCloud && (
        <div
          className="absolute text-white text-xs bg-slate-700 p-2 rounded-xl shadow-md z-20"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            top: cloudPosition === 'top' ? `${y - 80}px` : undefined,
            bottom: cloudPosition === 'bottom' ? `${300 - y - 80}px` : undefined
          }}
        >
          <div>{cloudSet[Math.floor(Math.random() * cloudSet.length)]}</div>
        </div>
      )}
    </>
  );
};

const FlowDiagram = () => {
  const dotConfigs = [
    {
      key: 'context-dot',
      from: integrationContextPos,
      to: agentPos,
      bend: 'up',
      label: 'Context',
      type: 'context',
      cloudPosition: 'top',
      delay: 0,
      cloudSet: ["🟢 Clean Intent", "🟢 Verified Input", "🟢 Context Secure"]
    },
    {
      key: 'action-dot',
      from: agentPos,
      to: integrationActionPos,
      bend: 'down',
      label: 'Action',
      type: 'action',
      cloudPosition: 'bottom',
      delay: 1000,
      cloudSet: ["🟢 Safe Action", "🟢 Logged & Sent", "🟢 Executed Normally"]
    },
    {
    key: "user-query-dot",
    from: { x: 240, y: 60 }, // top-middle-left
    to: agentPos,
    bend: "up",
    label: "User Query",
    type: "context",
    cloudPosition: "top",
    delay: 500,
    cloudSet: ["💬 Hello!", "💬 What's on calendar?", "💬 Add meeting"]
    }

  ];

  return (
    <div className="relative w-full h-[400px] bg-slate-900 rounded-xl border border-slate-700 p-8 overflow-hidden">
      {/* Integration Context */}
      <div className="absolute left-4 top-6 w-28 h-20 bg-slate-800 rounded-xl border border-slate-600 flex items-center justify-center text-slate-300">
        <div className="text-sm">Integration A</div>
      </div>

      {/* Integration Action */}
      <div className="absolute left-4 bottom-6 w-28 h-20 bg-slate-800 rounded-xl border border-slate-600 flex items-center justify-center text-slate-300">
        <div className="text-sm">Integration B</div>
      </div>

      {/* User */}
      <div className="absolute top-0 right-[132px] w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white">🧑‍💻</div>

      {/* LLM */}
      <div className="absolute top-1/2 right-2 -translate-y-1/2 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white">🧠</div>

      {/* SVG Paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {/* Context Path */}
        <path d={`M ${integrationContextPos.x},${integrationContextPos.y} Q ${getMidpoint(integrationContextPos, agentPos, 'up').x},${getMidpoint(integrationContextPos, agentPos, 'up').y} ${agentPos.x},${agentPos.y}`} fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="2" />

        {/* Action Path */}
        <path d={`M ${agentPos.x},${agentPos.y} Q ${getMidpoint(agentPos, integrationActionPos, 'down').x},${getMidpoint(agentPos, integrationActionPos, 'down').y} ${integrationActionPos.x},${integrationActionPos.y}`} fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="2" />

        {/* User to Agent */}
        <line x1={userPos.x} y1={userPos.y + 30} x2={agentPos.x} y2={agentPos.y - 30} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

        {/* Agent to LLM */}
        <line x1={agentPos.x + 30} y1={agentPos.y} x2={llmPos.x - 10} y2={llmPos.y} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      </svg>
      {/* LLM communication arrows */}
<svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="white" />
    </marker>
  </defs>
  <line
    x1={agentPos.x + 40}
    y1={agentPos.y}
    x2={agentPos.x + 160}
    y2={agentPos.y - 30}
    stroke="white"
    strokeWidth="3"
    markerEnd="url(#arrowhead)"
  />
  <line
    x1={agentPos.x + 160}
    y1={agentPos.y + 30}
    x2={agentPos.x + 40}
    y2={agentPos.y}
    stroke="white"
    strokeWidth="3"
    markerEnd="url(#arrowhead)"
  />
</svg>

        {/* User */}
        <div className="absolute left-[200px] top-[20px] text-center z-10 text-white">
        <div className="mb-1">User</div>
        <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-lg">🧑</div>
        </div>

        {/* LLM */}
        <div className="absolute right-[40px] top-[100px] text-center z-10 text-white">
        <div className="mb-1">LLM</div>
        <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-xl">🔮</div>
        </div>

      {/* Dots */}
      {dotConfigs.map((config) => (
        <FlowDot key={config.key} {...config} />
      ))}

      {/* Agent */}
      <div className="absolute right-32 top-1/2 -translate-y-1/2 flex flex-col items-center text-center text-slate-300">
        <div className="mb-2">Agent</div>
        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center shadow-lg text-lg">🤖</div>
      </div>
    </div>
  );
};

export default FlowDiagram;
