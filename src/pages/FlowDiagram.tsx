import React, { useEffect, useRef, useState } from 'react';
import { Vector2 } from 'three';

const Aypos = 46;
const Bypos = 350;
const agentxpos = 450; // Center x position for agent
const integrationAPos = new Vector2(62, Aypos); // Left upper position
const shiftIntegrationA  = new Vector2(60, 50); // Shift for integration A 

const integrationBPos = new Vector2(62, Bypos); // Left lower position
const shiftIntegrationB  = new Vector2(60, 50); // Shift for integration A 

const agentPos = new Vector2(agentxpos, (Aypos + Bypos) / 2); // Center position
const shiftAgent  = new Vector2(10, 30); // Shift for integration A 

const llmPos = new Vector2(680, (Aypos + Bypos) / 2);

const userPos = new Vector2(agentxpos, 20);
const shiftUser  = new Vector2(10, 50); // Shift for integration A 


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

const FlowDot = ({ 
  from, 
  to, 
  bend, 
  label, 
  type, 
  cloudPosition, 
  cloudSet, 
  delay = 0,
  cloudTranslateX = 0,
  cloudTranslateY = 0 
}) => {
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
  }, [paused, delay, speed]);

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
          className="absolute text-white text-xs bg-slate-700 p-2 rounded-xl shadow-md z-30"
          style={{
            left: cloudPosition === 'left' ? `${x - 10 + cloudTranslateX}px` :
                  cloudPosition === 'right' ? `${x + 10 + cloudTranslateX}px` :
                  `${x + cloudTranslateX}px`,
            top: cloudPosition === 'top' ? `${y - 10 - cloudTranslateY}px` :
                 cloudPosition === 'bottom' ? `${y + 10 + cloudTranslateY}px` :
                 `${y + cloudTranslateY}px`,
            transform: cloudPosition === 'top' || cloudPosition === 'bottom' ? 'translate(-50%, 0)' : 'translate(0, -50%)',
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
      from: new Vector2(integrationAPos.x + shiftIntegrationA.x, integrationAPos.y + shiftIntegrationA.y),
      to: new Vector2(agentPos.x + shiftAgent.x, agentPos.y + shiftAgent.y),
      bend: 'up',
      label: 'Context',
      type: 'context',
      cloudPosition: 'top',
      cloudTranslateY: 30,
      delay: 0,
      cloudSet: ["🟢 Clean Intent", "🟢 Verified Input", "🟢 Context Secure"]
    },
    {
      key: 'action-dot',
      from: new Vector2(agentPos.x + shiftAgent.x, agentPos.y + shiftAgent.y),
      to: new Vector2(integrationBPos.x + shiftIntegrationB.x, integrationBPos.y + shiftIntegrationB.y),
      bend: 'down',
      label: 'Action',
      type: 'action',
      cloudPosition: 'bottom',
      cloudTranslateY: 20,
      delay: 1000,
      cloudSet: ["🟢 Safe Action", "🟢 Logged & Sent", "🟢 Executed Normally"]
    },
    {
    key: "user-query-dot",
    from: new Vector2(userPos.x + shiftUser.x, userPos.y + shiftUser.y), // top-middle-left
    to: new Vector2(agentPos.x + shiftAgent.x, agentPos.y + shiftAgent.y),
    bend: "up",
    label: "User Query",
    type: "context",
    cloudPosition: "right",
    cloudTranslateX: 50,
    delay: 500,
    cloudSet: ["💬 Hello!", "💬 What's on calendar?", "💬 Add meeting"]
    }

  ];

  return (
    <div className="relative w-full h-[500px] w-[1000px] mx-auto bg-slate-900 rounded-xl border border-slate-700 p-8 overflow-hidden">
      {/* SVG Paths Layer */}
      <div className="absolute inset-0 z-20">
        {/* Integration Context */}
        <div className="absolute w-28 h-20 bg-slate-800 rounded-xl border border-slate-600 flex items-center justify-center text-slate-300"
          style={{ left: integrationAPos.x, top: integrationAPos.y }}>
          <div className="text-sm">Integration A</div>
        </div>

        {/* Integration Action */}
        <div className="absolute w-28 h-20 bg-slate-800 rounded-xl border border-slate-600 flex items-center justify-center text-slate-300"
          style={{ left: integrationBPos.x, top: integrationBPos.y }}>
          <div className="text-sm">Integration B</div>
        </div>
      </div>

      {/* Interactive Elements Layer */}
      <div className="absolute inset-0 z-20">
        {/* User */}
        <div className="absolute text-center text-white"
          style={{ left: userPos.x - 24, top: userPos.y - 24 }}>
          <div className="mb-1">User</div>
          <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-lg shadow-lg hover:shadow-xl transition-shadow">🧑</div>
        </div>

        {/* LLM */}
        <div className="absolute text-center text-white"
          style={{ left: llmPos.x - 24, top: llmPos.y - 24 }}>
          <div className="mb-1">LLM</div>
          <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-xl shadow-lg hover:shadow-xl transition-shadow">🔮</div>
        </div>

        {/* Agent */}
        <div className="absolute flex flex-col items-center text-center text-slate-300"
          style={{ left: agentPos.x - 32, top: agentPos.y - 32 }}>
          <div className="mb-2">Agent</div>
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow text-lg">🤖</div>
        </div>
      </div>

      {/* SVG Paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {/* Context Path */}
        <path d={`M ${integrationAPos.x + shiftIntegrationA.x},${integrationAPos.y + shiftIntegrationA.y} Q ${getMidpoint(
          { x: integrationAPos.x + shiftIntegrationA.x, y: integrationAPos.y + shiftIntegrationA.y },
          { x: agentPos.x + shiftAgent.x, y: agentPos.y + shiftAgent.y },
          'up').x},${getMidpoint(
          { x: integrationAPos.x + shiftIntegrationA.x, y: integrationAPos.y + shiftIntegrationA.y },
          { x: agentPos.x + shiftAgent.x, y: agentPos.y + shiftAgent.y },
          'up').y} ${agentPos.x + shiftAgent.x},${agentPos.y + shiftAgent.y}`} fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="2" />

        {/* Action Path */}
        <path d={`M ${agentPos.x + shiftAgent.x},${agentPos.y + shiftAgent.y} Q ${getMidpoint(
          { x: agentPos.x + shiftAgent.x, y: agentPos.y + shiftAgent.y },
          { x: integrationBPos.x + shiftIntegrationB.x, y: integrationBPos.y + shiftIntegrationB.y },
          'down').x},${getMidpoint(
          { x: agentPos.x + shiftAgent.x, y: agentPos.y + shiftAgent.y },
          { x: integrationBPos.x + shiftIntegrationB.x, y: integrationBPos.y + shiftIntegrationB.y },
          'down').y} ${integrationBPos.x + shiftIntegrationB.x},${integrationBPos.y + shiftIntegrationB.y}`} fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="2" />

        {/* User Path */}
        <path d={`M ${userPos.x + shiftUser.x},${userPos.y + shiftUser.y} Q ${getMidpoint(
          { x: userPos.x + shiftUser.x, y: userPos.y + shiftUser.y },
          { x: agentPos.x + shiftAgent.x, y: agentPos.y + shiftAgent.y },
          'up').x},${getMidpoint(
          { x: userPos.x + shiftUser.x, y: userPos.y + shiftUser.y },
          { x: agentPos.x + shiftAgent.x, y: agentPos.y + shiftAgent.y },
          'up').y} ${agentPos.x + shiftAgent.x},${agentPos.y + shiftAgent.y}`} fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="2" />
      </svg>

      {/* Dots */}
      {dotConfigs.map((config) => (
        <FlowDot key={config.key} {...config} />
      ))}
    </div>
  );
};

export default FlowDiagram;
