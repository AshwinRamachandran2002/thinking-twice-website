import React, { useRef, useLayoutEffect, useEffect } from "react";
import { Vector2 } from "three";

/**************************************************************************
 *  Shared maths helpers (geometry unchanged) + new tangent helper
 **************************************************************************/
const bezierPt = (t, p0, p1, p2) => ({
  x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x,
  y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y,
});

const bezierTangent = (t, p0, p1, p2) => {
  const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
};

/**************************************************************************
 *  FlowDiagram – redesigned visuals per user request
 **************************************************************************/
const MAX_CONCURRENT = 2;
const SPAWN_MIN = 3000;
const SPAWN_MAX = 7000;
const PROGRESS_SPEED = 0.0125;
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const CANVAS_RATIO = 900 / 320; // maintain original aspect

// List of integration image URLs (update as needed)
const leftIntegrationImages = [
  '/src/assets/slack.svg',
  '/src/assets/slack.svg',
  '/src/assets/slack.svg',
  '/src/assets/slack.svg',
  '/src/assets/slack.svg',
];
const leftIntegrationImagesTop = [
  '/src/assets/slack.svg',
  '/src/assets/slack.svg',
  '/src/assets/slack.svg',
];
const rightIntegrationImages = [...leftIntegrationImages]; // Mirror
const rightIntegrationImagesTop = [...leftIntegrationImagesTop]; // Mirror

// === Global control variables ===
// Arrow start X positions
export const leftArrowStartX = 170; // Change this to control all left arrows
export const rightArrowStartX = 1720; // Change this to control all right arrows
// FlowDiagram wrapper controls
export const diagramWidth = '100%'; // e.g. '900px' or '100%'
export const diagramHeight = '160px'; // e.g. '320px', 'auto', or '100%'
export const diagramX = 0; // px offset from left
export const diagramY = -20; // px offset from top

export const FlowDiagram = () => {
  // Global center coordinates for each integration set (memoized for stable references)
  const leftCenter = React.useMemo(() => ({ x: 100, y: 90 }), []);      // Controls left (bottom) layer
  const leftTopCenter = React.useMemo(() => ({ x: 120, y: 100 }), []);    // Controls left (top) layer
  const rightCenter = React.useMemo(() => ({ x: 1790, y: 90 }), []);     // Controls right (bottom) layer
  const rightTopCenter = React.useMemo(() => ({ x: 1770, y: 100 }), []);   // Controls right (top) layer

  // Compute layer positions relative to their own center
  const leftY = React.useMemo(() => [
    leftCenter.y - 60,
    leftCenter.y - 20,
    leftCenter.y + 20,
    leftCenter.y + 60,
    leftCenter.y + 100,
  ], [leftCenter]);
  const leftYTop = React.useMemo(() => [
    leftTopCenter.y - 45,
    leftTopCenter.y,
    leftTopCenter.y + 45,
  ], [leftTopCenter]);
  const rightY = React.useMemo(() => [
    rightCenter.y - 60,
    rightCenter.y - 20,
    rightCenter.y + 20,
    rightCenter.y + 60,
    rightCenter.y + 100,
  ], [rightCenter]);
  const rightYTop = React.useMemo(() => [
    rightTopCenter.y - 45,
    rightTopCenter.y,
    rightTopCenter.y + 45,
  ], [rightTopCenter]);
  const rightXTop = rightTopCenter.x - 20;
  const leftX = leftCenter.x - 20;
  const leftXTop = leftTopCenter.x + 20;
  const rightX = rightCenter.x + 20;

  const agentXOffset = -120; // relative to centre
  const fortXOffset  =  120;

  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const tokens = useRef([]);
  const nextSpawn = useRef(Date.now() + rand(SPAWN_MIN, SPAWN_MAX));
  const raf = useRef<number | undefined>(undefined);

  /* ------------------------- layout constants ------------------------ */

  const resize = () => {
    const w = wrapperRef.current.clientWidth;
    const h = w / CANVAS_RATIO;
    const c = canvasRef.current;
    c.width  = w;
    c.height = h;
  };

  useLayoutEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineCap = "round";

    // Preload images
    const imageCache = {};
    const allImages = [
      ...leftIntegrationImages,
      ...leftIntegrationImagesTop,
      ...rightIntegrationImages,
      ...rightIntegrationImagesTop,
    ];
    allImages.forEach((url) => {
      if (!imageCache[url]) {
        const img = new window.Image();
        img.src = url;
        imageCache[url] = img;
      }
    });

    const loop = () => {
      const { width: WIDTH, height: HEIGHT } = canvas;
      const centreX = WIDTH / 2;
      const agent   = { x: centreX + agentXOffset, y: HEIGHT / 2 - 220 };
      const fort    = { x: centreX + fortXOffset,  y: HEIGHT / 2 - 220 };

      /* ------------------------------ spawn --------------------------- */
      const now = Date.now();
      if (now >= nextSpawn.current && tokens.current.length < MAX_CONCURRENT) {
        nextSpawn.current = now + rand(SPAWN_MIN, SPAWN_MAX);
        tokens.current.push({
          t: 0,
          stage: 0,
          devil: Math.random() < 0.4,
          label: Math.random() < 0.5 ? "Jira" : "Slack",
          lane: rand(0, leftY.length - 1),
        });
      }

      /* ------------------------------ clear --------------------------- */
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      /* ------------------------- helpers ----------------------------- */
      const drawGlassBox = (x, y, w, h, label) => {
        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 12);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.fillText(label, x + w / 2, y + h / 2);
        ctx.restore();
      };

      const arrowHead = (x, y, dir, colour) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.atan2(dir.y, dir.x));
        ctx.strokeStyle = colour;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-8, 4);
        ctx.lineTo(0, 0);
        ctx.lineTo(-8, -4);
        ctx.stroke();
        ctx.restore();
      };

      const curve = (p0, p1, p2, c0, c1, width = 1.5) => {
        ctx.save();
        const grad = ctx.createLinearGradient(p0.x, p0.y, p2.x, p2.y);
        grad.addColorStop(0, c0);
        grad.addColorStop(1, c1);
        ctx.strokeStyle = grad;
        ctx.lineWidth = width;
        ctx.shadowColor = c1;
        ctx.shadowBlur = 12; // reduced blur for performance
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
        arrowHead(p2.x, p2.y, bezierTangent(1, p0, p1, p2), c1);
        ctx.restore();
      };

      /* -------------------- static node drawing ---------------------- */
      // Draw integration images (left, bottom layer)
      leftY.forEach((yy, i) => {
        const img = imageCache[leftIntegrationImages[i]];
        if (img && img.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(leftX, yy, 22, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, leftX - 22, yy - 22, 44, 44);
          ctx.restore();
        } else {
          // fallback circle
          ctx.save();
          ctx.beginPath();
          ctx.arc(leftX, yy, 22, 0, 2 * Math.PI);
          ctx.fillStyle = '#e0e7ef';
          ctx.fill();
          ctx.restore();
        }
      });
      // Draw integration images (left, top layer, offset)
      leftYTop.forEach((yy, i) => {
        const img = imageCache[leftIntegrationImagesTop[i]];
        if (img && img.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(leftXTop, yy, 18, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, leftXTop - 18, yy - 18, 36, 36);
          ctx.restore();
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(leftXTop, yy, 18, 0, 2 * Math.PI);
          ctx.fillStyle = '#e0e7ef';
          ctx.fill();
          ctx.restore();
        }
      });
      // Draw integration images (right, bottom layer)
      rightY.forEach((yy, i) => {
        const img = imageCache[rightIntegrationImages[i]];
        if (img && img.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(rightX, yy, 22, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, rightX - 22, yy - 22, 44, 44);
          ctx.restore();
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(rightX, yy, 22, 0, 2 * Math.PI);
          ctx.fillStyle = '#e0e7ef';
          ctx.fill();
          ctx.restore();
        }
      });
      // Draw integration images (right, top layer, offset)
      rightYTop.forEach((yy, i) => {
        const img = imageCache[rightIntegrationImagesTop[i]];
        if (img && img.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(rightXTop, yy, 18, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, rightXTop - 18, yy - 18, 36, 36);
          ctx.restore();
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(rightXTop, yy, 18, 0, 2 * Math.PI);
          ctx.fillStyle = '#e0e7ef';
          ctx.fill();
          ctx.restore();
        }
      });

      // Draw agent and fort boxes
      drawGlassBox(agent.x, agent.y - 40, 120, 80, "Agent");
      drawGlassBox(fort.x, fort.y - 40, 120, 80, "ContextFort");

      /* ------------------------ pipes ------------------------------- */
      // Left (bottom) layer arrows
      leftY.forEach((yy) => {
        const p0 = new Vector2(leftArrowStartX, yy);
        const p1 = new Vector2(agent.x - 70, yy);
        const p2 = new Vector2(agent.x, agent.y);
        curve(p0, p1, p2, "#0891b2", "#06b6d4"); // cyan
      });
      // Left (top) layer arrows (optional, uncomment if needed)
      // leftYTop.forEach((yy) => {
      //   const p0 = new Vector2(leftXTop, yy);
      //   const p1 = new Vector2(agent.x - 50, yy);
      //   const p2 = new Vector2(agent.x, agent.y);
      //   curve(p0, p1, p2, "#0891b2", "#06b6d4");
      // });

      // Middle arrow (agent to fort) with dynamic control point
      const midControlX = (agent.x + fort.x) / 2;
      const midControlY = Math.min(agent.y, fort.y) - 70; // 70px above the higher box
      curve(
        new Vector2(agent.x + 80, agent.y),
        new Vector2(midControlX, midControlY),
        new Vector2(fort.x - 80, fort.y),
        "#7c3aed",
        "#8b5cf6",
        2.5,
      );

      // Right (bottom) layer arrows
      rightY.forEach((yy) => {
        const p0 = new Vector2(fort.x + 40, fort.y);
        const p1 = new Vector2(rightArrowStartX - 70, yy);
        const p2 = new Vector2(rightArrowStartX, yy);
        curve(p0, p1, p2, "#ea580c", "#f97316"); // orange
      });
      // Right (top) layer arrows (optional, uncomment if needed)
      // rightYTop.forEach((yy) => {
      //   const p0 = new Vector2(fort.x + 40, fort.y);
      //   const p1 = new Vector2(rightXTop - 50, yy);
      //   const p2 = new Vector2(rightXTop, yy);
      //   curve(p0, p1, p2, "#ea580c", "#f97316");
      // });

      /* ---------------------- moving tokens ------------------------- */
      tokens.current = tokens.current.filter((m) => m.stage < 3);
      tokens.current.forEach((m) => {
        // easing: sine-wave speed modulation
        m.t = Math.min(
          1,
          m.t + PROGRESS_SPEED * (0.5 + 0.5 * Math.sin(performance.now() / 400)),
        );
        if (m.t >= 1) {
          m.t = 0;
          m.stage++;
        }
        let p0, p1, p2;
        if (m.stage === 0) {
          p0 = new Vector2(leftArrowStartX, leftY[m.lane]);
          p1 = new Vector2(agent.x - 70, p0.y);
          p2 = new Vector2(agent.x, agent.y);
        } else if (m.stage === 1) {
          p0 = new Vector2(agent.x + 80, agent.y);
          p1 = new Vector2(centreX, agent.y - 70);
          p2 = new Vector2(fort.x - 80, fort.y);
        } else if (m.stage === 2 && !m.devil) {
          p0 = new Vector2(fort.x + 40, fort.y);
          p1 = new Vector2(rightArrowStartX - 70, rightY[m.lane]);
          p2 = new Vector2(rightArrowStartX, rightY[m.lane]);
        } else if (m.stage === 2 && m.devil) {
          // Only blur this token, not the whole canvas
          const yDrop = fort.y + m.t * 120;
          ctx.save();
          ctx.globalAlpha = 0.6;
          ctx.filter = "blur(1.2px)"; // lighter blur
          ctx.beginPath();
          ctx.arc(fort.x + 60, yDrop, 12, 0, 2 * Math.PI);
          ctx.fillStyle = "#f87171"; // red for devil
          ctx.fill();
          ctx.filter = "none";
          ctx.restore();
          return;
        } else {
          return;
        }
        const { x, y } = bezierPt(m.t, p0, p1, p2);
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = m.label === "Slack" ? "#60a5fa" : "#fbbf24"; // blue or yellow
        ctx.shadowColor = m.label === "Slack" ? "#60a5fa" : "#fbbf24";
        ctx.shadowBlur = 6; // subtle glow
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      });

      // --- Removed global StackBlur for performance ---
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [agentXOffset, leftY, leftYTop, rightY, rightYTop, leftX, leftXTop, rightX, rightXTop]);

  return (
    <div
      ref={wrapperRef}
      className="w-full aspect-[900/320]"
      style={{
        width: diagramWidth,
        height: diagramHeight,
        left: diagramX,
        top: diagramY,
        position: 'relative', // allow X/Y offset
      }}
    >
      <canvas ref={canvasRef} className="rounded-xl shadow-2xl" style={{ background: 'transparent' }} />
    </div>
  );
};
