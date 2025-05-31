import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Vector2 } from 'three';
import * as flowConsts from './flowConstants';
const speed = 1 / (flowConsts.flowDurationMs / 16);   // uses constant above

/***************************
 * Utility helpers (unchanged)
 ***************************/
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

/***************************
 * Dot component (minimal logic tweaks, big visual glow)
 ***************************/
const FlowDot = ({
  from,
  to,
  bend,
  label,
  cloudPosition,
  cloudTranslateX = 0,
  cloudTranslateY = 0,
  setIdx,
  cloudText,
  t,
  showCloud,
  color,
}) => {
  const mid = getMidpoint(from, to, bend);
  const { x, y } = getQuadraticBezierPoint(t, from, mid, to);
  const opacity = t < 0.25 ? t / 0.25 : t > 0.75 ? (1 - t) / 0.25 : 1;
/* choose colour based on “normal” vs “advarsarial” set */
  const colour =
    label === 'Context' || label === 'Action'
      ? (flowConsts.cloudTypeSets[setIdx] === 'advarsarial'
          ? flowConsts.adversarialColor
          : flowConsts.normalColor)
      : 'rgb(14,165,233)';                          // cyan for user dot

  return (
    <>
      {/* Moving dot */}
      <motion.div
        className="absolute h-2 w-2 rounded-full shadow-lg"
        style={{
          left: x,
          top: y,
          background: colour,
          boxShadow: `0 0 8px 2px ${colour}`,
          transform: 'translate(-50%, -50%)',
          opacity,
        }}
      />

      {/* Text label */}
      <motion.span
        className="absolute text-[10px] font-semibold tracking-wide uppercase"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          left: x,
          top: y - 16,
          transform: 'translate(-50%, -50%)',
          colour,
        }}
      >
        {label}
      </motion.span>

      {/* Speech‑cloud */}
      {showCloud && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="absolute z-40 whitespace-nowrap rounded-xl bg-slate-800/90 px-3 py-2 text-xs font-medium text-slate-100 shadow-lg backdrop-blur"
          style={{
            left:
              cloudPosition === 'left'
                ? x + cloudTranslateX - 14
                : cloudPosition === 'right'
                ? x + cloudTranslateX + 14
                : x + cloudTranslateX,
            top:
              cloudPosition === 'top'
                ? y - cloudTranslateY - 14
                : cloudPosition === 'bottom'
                ? y + cloudTranslateY + 14
                : y + cloudTranslateY,
            transform:
              cloudPosition === 'top' || cloudPosition === 'bottom'
                ? 'translate(-50%, 0)'
                : 'translate(0, -50%)',
          }}
        >
          {cloudText}
        </motion.div>
      )}
    </>
  );
};

/***************************
 * Main FlowDiagram component
 ***************************/
const FlowDiagram = () => {
  /***** Config arrays (logic retained) *****/
  const dotConfigs = [
    {
      key: 'context-dot',
      from: new Vector2(
        flowConsts.integrationAPos.x + flowConsts.shiftIntegrationA.x,
        flowConsts.integrationAPos.y + flowConsts.shiftIntegrationA.y,
      ),
      to: new Vector2(
        flowConsts.agentPos.x + flowConsts.shiftAgent.x,
        flowConsts.agentPos.y + flowConsts.shiftAgent.y,
      ),
      bend: 'up',
      label: 'Context',
      cloudPosition: 'top',
      cloudTranslateY: 30,
    },
    {
      key: 'action-dot',
      from: new Vector2(
        flowConsts.agentPos.x + flowConsts.shiftAgent.x,
        flowConsts.agentPos.y + flowConsts.shiftAgent.y,
      ),
      to: new Vector2(
        flowConsts.integrationBPos.x + flowConsts.shiftIntegrationB.x,
        flowConsts.integrationBPos.y + flowConsts.shiftIntegrationB.y,
      ),
      bend: 'down',
      label: 'Action',
      cloudPosition: 'bottom',
      cloudTranslateY: 20,
    },
    {
      key: 'user-query-dot',
      from: new Vector2(
        flowConsts.userPos.x + flowConsts.shiftUser.x,
        flowConsts.userPos.y + flowConsts.shiftUser.y,
      ),
      to: new Vector2(
        flowConsts.agentPos.x + flowConsts.shiftAgent.x,
        flowConsts.agentPos.y + flowConsts.shiftAgent.y,
      ),
      bend: 'up',
      label: 'User',
      cloudPosition: 'right',
      cloudTranslateX: 42,
    },
    {
      key: 'context-dot-llm',
      from: new Vector2(
        flowConsts.agentPos.x + flowConsts.shiftAgent.x,
        flowConsts.agentPos.y + flowConsts.shiftAgent.y,
      ),
      to: new Vector2(
        flowConsts.llmPos.x + flowConsts.shiftLLM.x,
        flowConsts.llmPos.y + flowConsts.shiftLLM.y,
      ),
      bend: 'up',
      label: 'Context',
      cloudPosition: 'top',
      cloudTranslateY: 30,
    },
    {
      key: 'action-dot-llm',
      from: new Vector2(
        flowConsts.llmPos.x + flowConsts.shiftLLM.x,
        flowConsts.llmPos.y + flowConsts.shiftLLM.y,
      ),
      to: new Vector2(
        flowConsts.agentPos.x + flowConsts.shiftAgent.x,
        flowConsts.agentPos.y + flowConsts.shiftAgent.y,
      ),
      bend: 'down',
      label: 'Action',
      cloudPosition: 'bottom',
      cloudTranslateY: 20,
    },
  ];
  /* ---------- z-index: bring entities in front ---------- */
  const ENTITY_Z  = 20;  // big number > arrow z-index
  const ARROW_Z   = 10;  // below boxes, but above background

  /***** Animation state (logic retained) *****/
  const duration = 2000; // ms (reduced for faster flow)
  const speed = 1 / (duration / 16);
  const [t, setT] = useState(0);
  const [showCloud, setShowCloud] = useState(false);
  const [cloudSetIdx, setCloudSetIdx] = useState(0);
  const pausedRef = useRef(false);
  const hasPausedThisCycleRef = useRef(false);
  const frameRef = useRef();
  const cloudTimeoutRef = useRef();

  useEffect(() => {
    const loop = () => {
      frameRef.current = requestAnimationFrame(loop);
      setT((prevT) => {
        const nextT = prevT + (pausedRef.current ? 0 : speed);

        if (!pausedRef.current && !hasPausedThisCycleRef.current && Math.abs(nextT - 0.5) < speed / 1.5) {
          pausedRef.current = true;
          setShowCloud(true);
          hasPausedThisCycleRef.current = true;
          cloudTimeoutRef.current = setTimeout(() => {
            setShowCloud(false);
            pausedRef.current = false;
          }, 1600);
        }

        if (nextT >= 1) {
          setTimeout(() => {
            setCloudSetIdx((idx) => (idx + 1) % flowConsts.cloudTextSets.length);
            setT(0);
            setShowCloud(false);
            pausedRef.current = false;
            hasPausedThisCycleRef.current = false;
          }, 500);
          return 1;
        }
        return nextT;
      });
    };
    loop();
    return () => {
      cancelAnimationFrame(frameRef.current);
      clearTimeout(cloudTimeoutRef.current);
    };
  }, [speed]);

  /***** Visual helpers *****/
  const colorForIdx = (i) =>
    i % 2 === 0 ? 'rgb(34,197,94)' /* emerald‑500 */ : 'rgb(239,68,68)'; /* red‑500 */

  const dotOrder = [2, 0, 3, 4, 1];

  /***** JSX *****/
  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[1040px] overflow-visible rounded-3xl border border-slate-700 bg-gradient-to-b from-slate-900/60 via-slate-800/60 to-slate-900/60 p-6 shadow-xl">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-tr from-indigo-600/10 via-cyan-500/10 to-purple-500/10 blur-xl" />

      {/* Decorative grid */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[url('/grid.svg')] bg-[length:120px_120px] opacity-[0.03]" />

      {/* Entity boxes */}
      {[
        { title: 'Integration A', pos: flowConsts.integrationAPos },
        { title: 'Integration B', pos: flowConsts.integrationBPos },
        { title: 'Agent', pos: flowConsts.agentPos, big: true },
        { title: 'LLM', pos: flowConsts.llmPos },
        { title: 'User', pos: flowConsts.userPos, circle: true },
      ].map(({ title, pos, big, circle }) => (
        <div
          key={title}
          className={
            circle
              ? 'absolute -translate-x-1/2 -translate-y-1/2 text-center'
              : 'absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center'
          }
          style={{ left: pos.x, top: pos.y, zIndex: ENTITY_Z }}   // ★ NEW
          >
          <div
            className={
              circle
                ? 'flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-xl shadow-lg'
                : big
                ? 'flex h-20 w-40 items-center justify-center rounded-2xl bg-slate-700/80 backdrop-blur text-slate-100 shadow-lg'
                : 'flex h-16 w-28 items-center justify-center rounded-xl bg-slate-800/80 backdrop-blur text-slate-200 shadow-lg'
            }
          >
            {circle ? '🧑' : title}
          </div>
        </div>
      ))}

      {/* Animated SVG paths */}
      <svg className="absolute inset-0 h-full w-full overflow-visible" style={{ zIndex: ARROW_Z }} fill="none">
        <defs>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(14,165,233)" />
            <stop offset="100%" stopColor="rgba(149,45,253,0.85)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[
          // Context A -> Agent
          {
            from: new Vector2(
              flowConsts.integrationAPos.x + flowConsts.shiftIntegrationA.x,
              flowConsts.integrationAPos.y + flowConsts.shiftIntegrationA.y,
            ),
            to: new Vector2(
              flowConsts.agentPos.x + flowConsts.shiftAgent.x,
              flowConsts.agentPos.y + flowConsts.shiftAgent.y,
            ),
            bend: 'up',
          },
          // Agent -> Integration B
          {
            from: new Vector2(
              flowConsts.agentPos.x + flowConsts.shiftAgent.x,
              flowConsts.agentPos.y + flowConsts.shiftAgent.y,
            ),
            to: new Vector2(
              flowConsts.integrationBPos.x + flowConsts.shiftIntegrationB.x,
              flowConsts.integrationBPos.y + flowConsts.shiftIntegrationB.y,
            ),
            bend: 'down',
          },
          // Agent -> LLM (context)
          {
            from: new Vector2(
              flowConsts.agentPos.x + flowConsts.shiftAgent.x,
              flowConsts.agentPos.y + flowConsts.shiftAgent.y,
            ),
            to: new Vector2(
              flowConsts.llmPos.x + flowConsts.shiftLLM.x,
              flowConsts.llmPos.y + flowConsts.shiftLLM.y,
            ),
            bend: 'up',
          },
          // LLM -> Agent (action)
          {
            from: new Vector2(
              flowConsts.llmPos.x + flowConsts.shiftLLM.x,
              flowConsts.llmPos.y + flowConsts.shiftLLM.y,
            ),
            to: new Vector2(
              flowConsts.agentPos.x + flowConsts.shiftAgent.x,
              flowConsts.agentPos.y + flowConsts.shiftAgent.y,
            ),
            bend: 'down',
          },
          // User -> Agent
          {
            from: new Vector2(
              flowConsts.userPos.x + flowConsts.shiftUser.x,
              flowConsts.userPos.y + flowConsts.shiftUser.y,
            ),
            to: new Vector2(
              flowConsts.agentPos.x + flowConsts.shiftAgent.x,
              flowConsts.agentPos.y + flowConsts.shiftAgent.y,
            ),
            bend: 'up',
          },
        ].map(({ from, to, bend }, idx) => {
          const mid = getMidpoint(from, to, bend);
          return (
            <motion.path
              key={idx}
              d={`M ${from.x},${from.y} Q ${mid.x},${mid.y} ${to.x},${to.y}`}
              stroke="url(#flowGrad)"
              strokeWidth={2}
              filter="url(#glow)"
              strokeLinecap="round"
              strokeDasharray="6 8"
              initial={{ pathLength: 0, strokeDashoffset: 18 }}
              animate={{ pathLength: 1, strokeDashoffset: 0 }}
              transition={{ duration: 1.2, delay: idx * 0.15, ease: 'easeInOut' }}
            />
          );
        })}
      </svg>

      {/* Moving dots + speech clouds */}
      {dotOrder.map((dotIdx) => (
        <FlowDot
          key={dotConfigs[dotIdx].key}
          {...dotConfigs[dotIdx]}
          setIdx={cloudSetIdx} 
          cloudText={flowConsts.cloudTextSets[cloudSetIdx][dotIdx]}
          t={t}
          showCloud={showCloud}
          color={colorForIdx(dotIdx)}
        />
      ))}
    </div>
  );
};

export default FlowDiagram;
