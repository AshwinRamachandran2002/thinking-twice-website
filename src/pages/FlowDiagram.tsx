import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const agentPos = { x: 460, y: 150 };
const integrationsBoxPos = { x: 90, y: 150 };

const integrations = [
  {
    id: 'calendar',
    name: 'Calendar',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path
          fill="#4285F4"
          d="M21.5 5.25H17V4h-2v1.25H9V4H7v1.25H2.5C1.12 5.25 0 6.37 0 7.75v12.5c0 1.38 1.12 2.5 2.5 2.5h19c1.38 0 2.5-1.12 2.5-2.5V7.75c0-1.38-1.12-2.5-2.5-2.5zm0 15H2.5V10h19v10.25z"
        />
      </svg>
    )
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    icon: (
      <svg viewBox="0 0 512 512" className="w-5 h-5">
        <path
          fill="#FF7A59"
          d="M267.4 1.11c-109.1-10.9-211.6 54.2-245.3 157.9-43.2 133 29.7 276 162.7 319.2 104.4 33.8 217.5-5.3 279.2-94.3l-50.6-31.7c-47.2 67.3-134.9 96.4-214.3 71.1-102.2-32.6-158.6-141.3-126-243.5 25.9-80.7 101.8-135.8 187-135.3l6.3-43.4z"
        />
      </svg>
    )
  }
];

const getRandomColor = () => (Math.random() > 0.5 ? '#22c55e' : '#ef4444');

const getMidpoint = (from: any, to: any, bend: 'up' | 'down') => {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 + (bend === 'up' ? -40 : 40);
  return { x: midX, y: midY };
};

const createCurvedPath = (from: any, to: any, bend: 'up' | 'down') => {
  const mid = getMidpoint(from, to, bend);
  return {
    initial: { x: from.x, y: from.y, opacity: 0, scale: 0 },
    animate: {
      x: [from.x, mid.x, to.x],
      y: [from.y, mid.y, to.y],
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0],
      transition: { duration: 4, repeat: Infinity, ease: 'linear' } // slowed down
    }
  };
};

const FlowDiagram = () => {
  const dotsPerDirection = 3;

  // Trigger re-render with different keys for animation randomness
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCycle(prev => prev + 1);
    }, 4000); // match the 4s animation duration
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[300px] bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between p-8">
      {/* Integrations Box */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 w-28 h-28 bg-slate-800 rounded-xl border border-slate-600 flex flex-col items-center justify-center space-y-2 text-slate-300">
        <div className="text-sm font-semibold">Integrations</div>
        <div className="flex gap-2 flex-wrap justify-center">
          {integrations.map(({ id, icon }) => (
            <div key={id} className="bg-white p-1 rounded-md shadow-sm">
              {icon}
            </div>
          ))}
        </div>
      </div>

      {/* Curved SVG paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path
          d={`M ${integrationsBoxPos.x},${integrationsBoxPos.y} Q ${getMidpoint(integrationsBoxPos, agentPos, 'up').x},${getMidpoint(integrationsBoxPos, agentPos, 'up').y} ${agentPos.x},${agentPos.y}`}
          fill="none"
          stroke="rgba(34,197,94,0.2)"
          strokeWidth="2"
        />
        <path
          d={`M ${agentPos.x},${agentPos.y} Q ${getMidpoint(agentPos, integrationsBoxPos, 'down').x},${getMidpoint(agentPos, integrationsBoxPos, 'down').y} ${integrationsBoxPos.x},${integrationsBoxPos.y}`}
          fill="none"
          stroke="rgba(239,68,68,0.2)"
          strokeWidth="2"
        />
      </svg>

      {/* Flowing labels */}
      <div className="absolute inset-0">
        {[...Array(dotsPerDirection)].map((_, i) => (
          <motion.div
            key={`context-${i}-${cycle}`} // forces re-mount per cycle
            className="absolute text-xs font-bold"
            style={{
              color: getRandomColor(),
              boxShadow: '0 0 8px rgba(0,0,0,0.3)'
            }}
            initial="initial"
            animate="animate"
            variants={createCurvedPath(integrationsBoxPos, agentPos, 'up')}
            transition={{ delay: i * 0.6 }}
          >
            Context
          </motion.div>
        ))}
        {[...Array(dotsPerDirection)].map((_, i) => (
          <motion.div
            key={`action-${i}-${cycle}`}
            className="absolute text-xs font-bold"
            style={{
              color: getRandomColor(),
              boxShadow: '0 0 8px rgba(0,0,0,0.3)'
            }}
            initial="initial"
            animate="animate"
            variants={createCurvedPath(agentPos, integrationsBoxPos, 'down')}
            transition={{ delay: i * 0.6 + 0.3 }}
          >
            Action
          </motion.div>
        ))}
      </div>

      {/* Agent */}
      <div className="flex flex-col items-center text-center text-slate-300 w-24 ml-auto mr-8">
        <div className="mb-2">Agent</div>
        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center shadow-lg">🤖</div>
      </div>
    </div>
  );
};

export default FlowDiagram;
