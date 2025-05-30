import React, { useEffect, useRef, useState } from 'react';

const agentPos = { x: 460, y: 150 };
const integrationsBoxPos = { x: 90, y: 150 };

const contextTexts = ["Requested Events", "Parsed Tokens", "Identified Intent"];
const actionTexts = ["Triggered Calendar", "Updated CRM", "Sent Summary"];

const getMidpoint = (from: any, to: any, bend: 'up' | 'down') => {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2 + (bend === 'up' ? -80 : 80); // was -40 / +40
    return { x: midX, y: midY };
};

const getQuadraticBezierPoint = (t: number, p0: any, p1: any, p2: any) => {
    const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
    const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
    return { x, y };
};
const getCloudText = (color: string, type: 'context' | 'action') => {
    const isGreen = color === '#22c55e';
    if (type === 'context') {
        return isGreen
            ? ["🟢 Clean Intent", "🟢 Verified Input", "🟢 Context Secure"]
            : ["🔴 Malformed Input", "🔴 Suspicious Pattern", "🔴 Context Alert"];
    } else {
        return isGreen
            ? ["🟢 Safe Action", "🟢 Logged & Sent", "🟢 Executed Normally"]
            : ["🔴 Potential Leak", "🔴 Action Blocked", "🔴 Escalated"];
    }
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

}: {
    from: any,
    to: any,
    bend: 'up' | 'down',
    label: string,
    type: 'context' | 'action',
    cloudPosition: 'top' | 'bottom',
    cloudSet: string[],
    delay: number

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
        let frameId: number;
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
    const cloudTexts = cloudSet.length ? cloudSet : getCloudText(color, type);

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
                    <div>{cloudTexts[Math.floor(Math.random() * cloudTexts.length)]}</div>

                </div>
            )}
        </>
    );
};


const FlowDiagram = () => {
    const dotsPerDirection = 1;
    const dotConfigs = [
        {
            key: "context-dot",
            from: integrationsBoxPos,
            to: agentPos,
            bend: "up",
            label: "Context",
            type: "context",
            cloudPosition: "top",
            delay: 0,
            cloudSet: [
                "🟢 Clean Intent",
                "🟢 Verified Input",
                "🟢 Context Secure"
            ],
        },
        {
            key: "action-dot",
            from: agentPos,
            to: integrationsBoxPos,
            bend: "down",
            label: "Action",
            type: "action",
            cloudPosition: "bottom",
            delay: 1000,
            cloudSet: [
                "🟢 Safe Action",
                "🟢 Logged & Sent",
                "🟢 Executed Normally"
            ],
        }
    ];

    return (
        <div className="relative w-full h-[300px] bg-slate-900 rounded-xl border border-slate-700 p-8 overflow-hidden">
            {/* Integrations Box */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 w-28 h-28 bg-slate-800 rounded-xl border border-slate-600 flex flex-col items-center justify-center space-y-2 text-slate-300 z-10">
                <div className="text-sm font-semibold">Integrations</div>
                <div className="flex gap-2">
                    <div className="w-5 h-5 rounded bg-blue-500" />
                    <div className="w-5 h-5 rounded bg-orange-400" />
                </div>
            </div>

            {/* SVG Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <path
                    d={`M ${integrationsBoxPos.x},${integrationsBoxPos.y} Q ${getMidpoint(integrationsBoxPos, agentPos, 'up').x},${getMidpoint(integrationsBoxPos, agentPos, 'up').y} ${agentPos.x},${agentPos.y}`}
                    fill="none"
                    stroke="rgba(59,130,246,0.3)"
                    strokeWidth="2"
                />
                <path
                    d={`M ${agentPos.x},${agentPos.y} Q ${getMidpoint(agentPos, integrationsBoxPos, 'down').x},${getMidpoint(agentPos, integrationsBoxPos, 'down').y} ${integrationsBoxPos.x},${integrationsBoxPos.y}`}
                    fill="none"
                    stroke="rgba(59,130,246,0.3)"
                    strokeWidth="2"
                />
            </svg>
            {dotConfigs.map((config) => (
                <FlowDot key={config.key} {...config} />
            ))}



            {/* Agent */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center text-center text-slate-300">
                <div className="mb-2">Agent</div>
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center shadow-lg text-lg">🤖</div>
            </div>
        </div>
    );
};

export default FlowDiagram;
