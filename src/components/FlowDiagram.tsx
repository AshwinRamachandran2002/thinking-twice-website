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
export const rightArrowStartX = 1630; // Change this to control all right arrows
// FlowDiagram wrapper controls
export const diagramWidth = '100%'; // e.g. '900px' or '100%'
export const diagramHeight = '190px'; // e.g. '320px', 'auto', or '100%'
export const diagramX = 0; // px offset from left
export const diagramY = -50; // px offset from top

// === Moving texts config ===
const DEVIL_IMG = '/src/assets/slack.svg'; // Replace with actual devil image path if available

const movingTexts = [
  {
    textLeft: "Jira Issue Details",
    textAgent: "Mark Jira Complete",
    textRight: "Mark Jira Complete",
    color: "#60a5fa",
    delay: 0,
    devillish: false
  },
  {
    textLeft: "Leak Slack Messages",
    textAgent: "Leak Slack Message",
    textRight: "Leak Thwarted",
    color: "#fbbf24",
    delay: 800,
    devillish: true
  },
  {                 
    textLeft: "Notion Document",
    textAgent: "Write to Notion Page",
    textRight: "Write to Notion Page",
    color: "#34d399",
    delay: 1600,
    devillish: false
  },
  {
    textLeft: "Leak Google Calendar",
    textAgent: "Leak Google Calendar",
    textRight: "Leak Thwarted",
    color: "#a78bfa",
    delay: 2400,
    devillish: true
  },
  {
    textLeft: "Gmail Thread",
    textAgent: "Send Gmail",
    textRight: "Send Gmail",
    color: "#f87171",
    delay: 3200,
    devillish: false
  },
];
const TEXT_FONT = "bold 18px Inter, sans-serif";
const TEXT_SPEED = 0.003; // progress per ms

// === Integration image size multipliers (global, easy to tweak) ===
const INTEGRATION_RADIUS = 0.02; // as fraction of WIDTH (bottom layer)
const INTEGRATION_IMG_SIZE = 0.025; // as fraction of WIDTH (bottom layer)
const INTEGRATION_TOP_RADIUS = 0.02; // as fraction of WIDTH (top layer)
const INTEGRATION_TOP_IMG_SIZE = 0.02; // as fraction of WIDTH (top layer)
const INTEGRATION_SPACING = 0.15; // as fraction of HEIGHT (vertical spacing between images)

// === Arrow offset globals ===
export const AGENT_TO_FORT_ARROW_OFFSET = -0.001; // as fraction of WIDTH (default 0.089)
export const FORT_TO_RIGHT_ARROW_OFFSET = 240; // in px (default 40)

export const FlowDiagram = () => {
  // Responsive base dimensions
  const BASE_WIDTH = 900;
  const BASE_HEIGHT = 320;

  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const tokens = useRef([]);
  const nextSpawn = useRef(Date.now() + rand(SPAWN_MIN, SPAWN_MAX));
  const raf = useRef<number | undefined>(undefined);

  // Responsive layout helpers
  const getScale = (w, h) => {
    return Math.min(w / BASE_WIDTH, h / BASE_HEIGHT);
  };

  // Responsive positions (all as fractions of width/height)
  const getLayout = (w, h) => {
    const scale = getScale(w, h);
    // Calculate base Y for each stack, then space by INTEGRATION_SPACING
    const leftBaseY = 0.14 * h;
    const rightBaseY = 0.14 * h;
    const lefttopBaseY = 0.31 * h;
    const righttopBaseY = 0.31 * h;
    return {
      leftCenter: { x: 0.055 * w, y: 0.28 * h },
      leftTopCenter: { x: 0.07 * w, y: 0.31 * h },
      rightCenter: { x: 0.945 * w, y: 0.28 * h },
      rightTopCenter: { x: 0.93 * w, y: 0.31 * h },
      leftY: Array.from({length: 5}, (_, i) => leftBaseY + i * INTEGRATION_SPACING * h),
      leftYTop: Array.from({length: 3}, (_, i) => lefttopBaseY + i * INTEGRATION_SPACING * h),
      rightY: Array.from({length: 5}, (_, i) => rightBaseY + i * INTEGRATION_SPACING * h),
      rightYTop: Array.from({length: 3}, (_, i) => righttopBaseY + i * INTEGRATION_SPACING * h),
      rightXTop: 0.93 * w,
      leftX: 0.045 * w,
      leftXTop: 0.08 * w,
      rightX: 0.965 * w,
      agentXOffset: -0.21 * w,
      fortXOffset: 0.08 * w,
      scale,
    };
  };

  // Track state for each moving text
  const textStates = useRef(
    movingTexts.map((t, i) => ({
      t: 0,
      stage: 0, // 0: left, 1: middle, 2: right, 3: devillish drop
      lastStart: Date.now() + (t.delay || 0),
      running: false,
      lane: i % 5, // distribute across lanes
    }))
  );

  /* ------------------------- layout constants ------------------------ */

  const resize = () => {
    const w = wrapperRef.current.clientWidth;
    // Use min/max for mobile friendliness
    const h = Math.max(180, Math.min(w / CANVAS_RATIO, 400));
    const c = canvasRef.current;
    c.width = w;
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
      DEVIL_IMG,
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
      const layout = getLayout(WIDTH, HEIGHT);
      const centreX = WIDTH / 2;
      const agent = { x: centreX + layout.agentXOffset, y: HEIGHT / 2 - 0.13 * HEIGHT };
      const fort = { x: centreX + layout.fortXOffset, y: HEIGHT / 2 - 0.13 * HEIGHT };

      /* ------------------------------ spawn --------------------------- */
      const now = Date.now();
      if (now >= nextSpawn.current && tokens.current.length < MAX_CONCURRENT) {
        nextSpawn.current = now + rand(SPAWN_MIN, SPAWN_MAX);
        tokens.current.push({
          t: 0,
          stage: 0,
          devil: Math.random() < 0.4,
          label: Math.random() < 0.5 ? "Jira" : "Slack",
          lane: rand(0, layout.leftY.length - 1),
        });
      }

      /* ------------------------------ clear --------------------------- */
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      /* ------------------------- helpers ----------------------------- */
      // Helper to draw a solid rounded rectangle (no glass effect)
      const drawSolidBox = (x, y, w, h, label, boxColor = "#fff", textColor = "#222") => {
        ctx.save();
        ctx.fillStyle = boxColor;
        ctx.globalAlpha = 0.97;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 12);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = textColor;
        ctx.font = "bold 18px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
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
      layout.leftY.forEach((yy, i) => {
        const img = imageCache[leftIntegrationImages[i]];
        if (img && img.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(layout.leftX, yy, INTEGRATION_RADIUS * WIDTH, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(
            img,
            layout.leftX - INTEGRATION_RADIUS * WIDTH,
            yy - INTEGRATION_RADIUS * WIDTH,
            INTEGRATION_IMG_SIZE * WIDTH,
            INTEGRATION_IMG_SIZE * WIDTH
          );
          ctx.restore();
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(layout.leftX, yy, INTEGRATION_RADIUS * WIDTH, 0, 2 * Math.PI);
          ctx.fillStyle = '#e0e7ef';
          ctx.fill();
          ctx.restore();
        }
      });
      // Draw integration images (left, top layer, offset)
      layout.leftYTop.forEach((yy, i) => {
        const img = imageCache[leftIntegrationImagesTop[i]];
        if (img && img.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(layout.leftXTop, yy, INTEGRATION_TOP_RADIUS * WIDTH, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(
            img,
            layout.leftXTop - INTEGRATION_TOP_RADIUS * WIDTH,
            yy - INTEGRATION_TOP_RADIUS * WIDTH,
            INTEGRATION_TOP_IMG_SIZE * WIDTH,
            INTEGRATION_TOP_IMG_SIZE * WIDTH
          );
          ctx.restore();
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(layout.leftXTop, yy, INTEGRATION_TOP_RADIUS * WIDTH, 0, 2 * Math.PI);
          ctx.fillStyle = '#e0e7ef';
          ctx.fill();
          ctx.restore();
        }
      });
      // Draw integration images (right, bottom layer)
      layout.rightY.forEach((yy, i) => {
        const img = imageCache[rightIntegrationImages[i]];
        if (img && img.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(layout.rightX, yy, INTEGRATION_RADIUS * WIDTH, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(
            img,
            layout.rightX - INTEGRATION_RADIUS * WIDTH,
            yy - INTEGRATION_RADIUS * WIDTH,
            INTEGRATION_IMG_SIZE * WIDTH,
            INTEGRATION_IMG_SIZE * WIDTH
          );
          ctx.restore();
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(layout.rightX, yy, INTEGRATION_RADIUS * WIDTH, 0, 2 * Math.PI);
          ctx.fillStyle = '#e0e7ef';
          ctx.fill();
          ctx.restore();
        }
      });
      // Draw integration images (right, top layer, offset)
      layout.rightYTop.forEach((yy, i) => {
        const img = imageCache[rightIntegrationImagesTop[i]];
        if (img && img.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(layout.rightXTop, yy, INTEGRATION_TOP_RADIUS * WIDTH, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(
            img,
            layout.rightXTop - INTEGRATION_TOP_RADIUS * WIDTH,
            yy - INTEGRATION_TOP_RADIUS * WIDTH,
            INTEGRATION_TOP_IMG_SIZE * WIDTH,
            INTEGRATION_TOP_IMG_SIZE * WIDTH
          );
          ctx.restore();
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(layout.rightXTop, yy, INTEGRATION_TOP_RADIUS * WIDTH, 0, 2 * Math.PI);
          ctx.fillStyle = '#e0e7ef';
          ctx.fill();
          ctx.restore();
        }
      });

      // ------------------------ pipes ------------------------------- //
      // Left (bottom) layer arrows
      layout.leftY.forEach((yy) => {
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
      const midControlY = Math.min(agent.y, fort.y) - 0.083 * HEIGHT; // 70px above the higher box
      curve(
        new Vector2(agent.x + AGENT_TO_FORT_ARROW_OFFSET * WIDTH, agent.y),
        new Vector2(midControlX, midControlY),
        new Vector2(fort.x - AGENT_TO_FORT_ARROW_OFFSET * WIDTH, fort.y),
        "#7c3aed",
        "#8b5cf6",
        2.5,
      );

      // Right (bottom) layer arrows
      layout.rightY.forEach((yy) => {
        const p0 = new Vector2(fort.x + FORT_TO_RIGHT_ARROW_OFFSET, fort.y);
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

      /* ---------------------- moving texts through all stages ------------------------- */
      textStates.current.forEach((state, i) => {
        const now = Date.now();
        const conf = movingTexts[i];
        if (!state.running && now - state.lastStart >= (conf.delay || 0)) {
          state.running = true;
        }
        if (state.running) {
          state.t += TEXT_SPEED * (16 + Math.random() * 8); // ~60fps, add jitter for natural feel
          if (state.t > 1) {
            state.t = 0;
            state.stage++;
            if (conf.devillish && state.stage === 3) {
              // devillish drop
              // let it drop, then reset
            } else if ((!conf.devillish && state.stage > 2) || (conf.devillish && state.stage > 3)) {
              state.stage = 0;
              state.running = false;
              state.lastStart = now;
            }
          }
        }
        if (state.running) {
          let p0, p1, p2, x, y;
          if (state.stage === 0) {
            // Left arrow: integration to agent
            p0 = { x: leftArrowStartX, y: layout.leftY[state.lane] };
            p1 = { x: agent.x - 70, y: layout.leftY[state.lane] };
            p2 = { x: agent.x, y: agent.y };
            ({ x, y } = bezierPt(state.t, p0, p1, p2));
          } else if (state.stage === 1) {
            // Middle arrow: agent to ContextFort
            const midControlX = (agent.x + fort.x) / 2;
            const midControlY = Math.min(agent.y, fort.y) - 70;
            p0 = { x: agent.x + 80, y: agent.y };
            p1 = { x: midControlX, y: midControlY };
            p2 = { x: fort.x - 80, y: fort.y };
            ({ x, y } = bezierPt(state.t, p0, p1, p2));
          } else if (state.stage === 2 && !conf.devillish) {
            // Right arrow: ContextFort to right integration (same lane)
            p0 = { x: fort.x + 40, y: fort.y };
            p1 = { x: rightArrowStartX - 70, y: layout.rightY[state.lane] };
            p2 = { x: rightArrowStartX, y: layout.rightY[state.lane] };
            ({ x, y } = bezierPt(state.t, p0, p1, p2));
          } else if (state.stage === 2 && conf.devillish) {
            // devillish drop from ContextFort
            x = fort.x + 60;
            y = fort.y + state.t * 120;
          } else if (state.stage === 3 && conf.devillish) {
            // fade out after drop
            x = fort.x + 60;
            y = fort.y + 120 + state.t * 40;
          }
          if (state.running && typeof x === 'number' && typeof y === 'number') {
            ctx.save();
            ctx.font = TEXT_FONT;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            if (conf.devillish) {
              ctx.globalAlpha = state.stage === 3 ? 1 - state.t : 1;
              // Draw devil image left of text
              const img = imageCache[DEVIL_IMG];
              if (img && img.complete) {
                ctx.drawImage(img, x - 38, y - 16, 28, 28);
              }
            }
            ctx.fillStyle = conf.color;
            ctx.shadowColor = conf.color;
            ctx.shadowBlur = 8;
            let displayText = conf.textLeft;
            if (state.stage === 1) displayText = conf.textAgent;
            else if (state.stage === 2 || state.stage === 3) displayText = conf.textRight;
            ctx.fillText(displayText, x, y);
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
            ctx.restore();
          }
        }
      });

      // === Draw agent and fort boxes last so they are always on top ===
      // Use website-matching color for the boxes (e.g. #f8fafc for bg, #0f172a for text)
      const AGENT_BOX_COLOR = "#f8fafc"; // light background
      const AGENT_TEXT_COLOR = "#0f172a"; // dark text
      drawSolidBox(agent.x, agent.y - 0.055 * HEIGHT, 0.133 * WIDTH, 0.13 * HEIGHT, "Agent", AGENT_BOX_COLOR, AGENT_TEXT_COLOR);
      drawSolidBox(fort.x, fort.y - 0.055 * HEIGHT, 0.133 * WIDTH, 0.13 * HEIGHT, "ContextFort", AGENT_BOX_COLOR, AGENT_TEXT_COLOR);
      // Draw box labels on top of everything
      ctx.save();
      ctx.font = "bold 18px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = AGENT_TEXT_COLOR;
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 6;
      ctx.fillText("Agent", agent.x + 0.133 * WIDTH / 2, agent.y - 0.055 * HEIGHT + 0.13 * HEIGHT / 2);
      ctx.fillText("ContextFort", fort.x + 0.133 * WIDTH / 2, fort.y - 0.055 * HEIGHT + 0.13 * HEIGHT / 2);
      ctx.shadowBlur = 0;
      ctx.restore();

      // --- Removed global StackBlur for performance ---
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  });

  return (
    <div
      ref={wrapperRef}
      className="w-full max-w-full aspect-[900/320] sm:aspect-[900/320]"
      style={{
        minHeight: 180,
        maxHeight: 400,
        width: '100%',
        left: diagramX,
        top: diagramY,
        position: 'relative',
      }}
    >
      <canvas ref={canvasRef} className="rounded-xl shadow-2xl w-full h-full" style={{ background: 'transparent', width: '100%', height: '100%' }} />
    </div>
  );
};
