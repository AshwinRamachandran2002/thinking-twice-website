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
/* choose colour based on “normal” vs “advarsial” set */
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
        style={{
          left: x,
          top: y - 16,
          transform: 'translate(-50%, -50%)',
          color: colour,
          opacity: opacity // match dot fade exactly
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
      cloudTranslateY: -30,
      cloudTranslateX: -100,
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
      cloudTranslateY: 30,
      cloudTranslateX: -100,
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
      cloudTranslateX: 20,
      cloudTranslateY: -50,
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
  const [lockedType, setLockedType] = useState(null);  // null → auto
  const pausedRef = useRef(false);
  const hasPausedThisCycleRef = useRef(false);
  const frameRef = useRef<number | undefined>();
  const cloudTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();
  const nextAllowedSetIdx = (current) => {
    let next = current;
    do {
      next = (next + 1) % flowConsts.cloudTextSets.length;
    } while (
      lockedType && flowConsts.cloudTypeSets[next] !== lockedType
    );
    return next;
  };
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
          }, 4000);
        }

        if (nextT >= 1) {
          setTimeout(() => {
            setCloudSetIdx((idx) => nextAllowedSetIdx(idx));
            setT(0);
            setShowCloud(false);
            pausedRef.current = false;
            hasPausedThisCycleRef.current = false;
          }, 3600);
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
  }, [speed, lockedType]);

  /*************************************************************************
   * Binary slider UI
   *************************************************************************/
  const effectiveType = lockedType || flowConsts.cloudTypeSets[cloudSetIdx];
  const isAdversarial = effectiveType === 'advarsarial';

  const handleToggle = () => {
    if (lockedType === null) {
      // first click → lock to whatever is showing now
      setLockedType(effectiveType);
    } else {
      // already locked → flip side
      setLockedType(lockedType === 'normal' ? 'advarsarial' : 'normal');
    }
  };

  const toggleLabel =
    lockedType === null
      ? 'Auto'
      : lockedType === 'normal'
      ? 'Safe only'
      : 'Adversarial only';

  const toggleColorClass =
    lockedType === null
      ? 'bg-slate-500'
      : lockedType === 'normal'
      ? 'bg-emerald-500'
      : 'bg-red-500';

  // Toggle button sizing (easy to adjust globally)
  const TOGGLE_WIDTH = 140; // px, wider for 'Adversarial'
  const TOGGLE_HEIGHT = 38; // px, slightly taller
  const TOGGLE_CIRCLE = 28; // px, circle diameter
  const TOGGLE_CIRCLE_SHIFT = TOGGLE_WIDTH - TOGGLE_CIRCLE - 8; // px, for translateX

  /***** Visual helpers *****/
  const colorForIdx = (i) =>
    i % 2 === 0 ? 'rgb(34,197,94)' /* emerald‑500 */ : 'rgb(239,68,68)'; /* red‑500 */

  const dotOrder = [2, 0, 3, 4, 1];

  /***** JSX *****/
  return (
    <div className="relative mx-auto h-[490px] w-full max-w-[840px] overflow-visible rounded-3xl border border-slate-700 bg-gradient-to-b from-slate-900/60 via-slate-800/60 to-slate-900/60 p-6 shadow-xl">
      {/* Slider */}
      <div className="absolute right-6 top-6 z-50 flex items-center">
        <div
          onClick={handleToggle}
          className={`relative flex items-center justify-between px-1 rounded-full cursor-pointer transition-colors duration-200 border-2 border-slate-600 shadow-lg select-none ${isAdversarial ? 'bg-red-600/70' : 'bg-emerald-600/70'}`}
          style={{ width: TOGGLE_WIDTH, height: TOGGLE_HEIGHT }}
        >
          {/* Centered label on left or right depending on toggle */}
          <span
            className={`absolute top-1/2 -translate-y-1/2 w-[80px] text-center text-sm font-semibold transition-all duration-200 text-slate-100`}
            style={{
              left: isAdversarial ? '0.5rem' : 'auto',
              right: isAdversarial ? 'auto' : '0.5rem',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            {isAdversarial ? 'Adversarial' : 'Safe'}
          </span>
          <div
            className="rounded-full bg-white shadow-md transition-transform duration-300"
            style={{
              width: TOGGLE_CIRCLE,
              height: TOGGLE_CIRCLE,
              transform: `translateX(${isAdversarial ? TOGGLE_CIRCLE_SHIFT : 0}px)`
            }}
          />
        </div>
      </div>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-tr from-indigo-600/10 via-cyan-500/10 to-purple-500/10 blur-xl" />

      {/* Decorative grid */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[url('/grid.svg')] bg-[length:120px_120px] opacity-[0.03]" />

      {/* Entity boxes/images */}
      {[ // Use images for Integration A/B, blocks for others
        { title: 'Integration A', pos: flowConsts.integrationAPos, imgIdx: 0 },
        { title: 'Integration B', pos: flowConsts.integrationBPos, imgIdx: 1, hide: !flowConsts.cloudTextSets[cloudSetIdx][1] },
        { title: 'Agent', pos: flowConsts.agentPos, big: true },
        { title: 'LLM', pos: flowConsts.llmPos },
        { title: 'User', pos: flowConsts.userPos, circle: true },
      ].filter(({ hide }) => !hide).map(({ title, pos, big, circle, imgIdx }) => (
        <div
          key={title}
          className={
            circle
              ? 'absolute -translate-x-1/2 -translate-y-1/2 text-center'
              : 'absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center'
          }
          style={{ left: pos.x, top: pos.y, zIndex: ENTITY_Z }}
        >
          {/* Render image for Integration A/B, block for others */}
          {typeof imgIdx === 'number' ? (
            <img
              src={flowConsts.integrationUrlSet[cloudSetIdx][imgIdx * 2]}
              alt={title}
              className="h-16 w-16 rounded-xl shadow-lg bg-white object-contain border border-slate-300"
              style={{ background: '#fff' }}
            />
          ) : (
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
          )}
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

        {/* Only draw arrows for action if cloudText is not empty */}
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
            label: 'Context',
            cloudIdx: 0,
          },
          // Agent -> Integration B (Action)
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
            label: 'Action',
            cloudIdx: 1,
            hide: !flowConsts.cloudTextSets[cloudSetIdx][1],
          },
          // Agent -> LLM (Context)
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
            label: 'Context',
            cloudIdx: 3,
          },
          // LLM -> Agent (Action)
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
            label: 'Action',
            cloudIdx: 4,
            hide: !flowConsts.cloudTextSets[cloudSetIdx][3],
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
            label: 'User',
            cloudIdx: 2,
          },
        ].filter(({ hide }) => !hide).map(({ from, to, bend, label, cloudIdx }, idx) => {
          // Only draw Action arrows if cloudText is not empty
          if (label === 'Action' && !flowConsts.cloudTextSets[cloudSetIdx][cloudIdx]) {
            return null;
          }
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
      {dotOrder.filter((dotIdx) => {
        // Hide dot if cloudText is empty for Action dots (Integration B and LLM Action)
        if (
          (dotIdx === 1 && !flowConsts.cloudTextSets[cloudSetIdx][1]) || // Integration B Action
          (dotIdx === 3) || // User dot always shown
          (dotIdx === 0) || // Context dot always shown
          (dotIdx === 2) || // User->Agent dot always shown
          (dotIdx === 4 && !flowConsts.cloudTextSets[cloudSetIdx][4]) // LLM Action
        ) {
          // Only show if not an Action dot with empty cloudText
          return !((dotIdx === 1 && !flowConsts.cloudTextSets[cloudSetIdx][1]) || (dotIdx === 4 && !flowConsts.cloudTextSets[cloudSetIdx][4]));
        }
        return true;
      }).map((dotIdx) => (
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
