import React, { useRef, useLayoutEffect, useEffect } from "react";
import { Vector2 } from "three";
import {
  MAX_CONCURRENT,
  SPAWN_MIN,
  SPAWN_MAX,
  rand,
  CANVAS_RATIO,
  leftIntegrationImages,
  leftIntegrationImagesTop,
  rightIntegrationImages,
  rightIntegrationImagesTop,
  leftArrowStartXFrac,
  rightArrowStartXFrac,
  AGENT_TO_FORT_ARROW_START_X_FRAC,
  AGENT_TO_FORT_ARROW_END_X_FRAC,
  diagramWidth,
  diagramHeight,
  diagramX,
  diagramY,
  DEVIL_IMG,
  movingTexts,
  TEXT_FONT,
  TEXT_SPEED,
  INTEGRATION_RADIUS,
  INTEGRATION_IMG_SIZE,
  INTEGRATION_TOP_RADIUS,
  INTEGRATION_TOP_IMG_SIZE,
  INTEGRATION_SPACING,
  AGENT_TO_FORT_ARROW_OFFSET,
  FORT_TO_RIGHT_ARROW_OFFSET,
  AGENT_TO_FORT_ARROW_START_X,
  AGENT_TO_FORT_ARROW_END_X,
  LEFT_TO_AGENT_ARROW_END_X,
  LEFT_TO_AGENT_ARROW_END_Y,
  RIGHT_TO_FORT_ARROW_START_X,
  RIGHT_TO_FORT_ARROW_START_Y,
  DEVIL_DROP_OFFSET_Y,
  CONTEXTFORT_BOX_WIDTH,
  CONTEXTFORT_BOX_HEIGHT,
  DEVIL_DROP_X,
} from './FlowDiagram.constants';

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
    // Use a minimum scale for mobile, but allow up to 1 for desktop
    return Math.min(w / BASE_WIDTH, h / BASE_HEIGHT, 1);
  };

  // Responsive positions (all as fractions of width/height)
  const getLayout = (w, h) => {
    const scale = getScale(w, h);
    // Mobile-specific tweaks
    const isMobile = w < 600;
    // Adjust Y positions and spacing for mobile
    const leftBaseY = isMobile ? 0.18 * h : 0.14 * h;
    const rightBaseY = isMobile ? 0.18 * h : 0.14 * h;
    const lefttopBaseY = isMobile ? 0.36 * h : 0.31 * h;
    const righttopBaseY = isMobile ? 0.36 * h : 0.31 * h;
    // More spacing between lanes on mobile
    const spacing = isMobile ? INTEGRATION_SPACING * 1.25 : INTEGRATION_SPACING;
    return {
      leftCenter: { x: 0.055 * w, y: 0.28 * h },
      leftTopCenter: { x: 0.07 * w, y: 0.31 * h },
      rightCenter: { x: 0.945 * w, y: 0.28 * h },
      rightTopCenter: { x: 0.93 * w, y: 0.31 * h },
      leftY: Array.from({length: 5}, (_, i) => leftBaseY + i * spacing * h),
      leftYTop: Array.from({length: 3}, (_, i) => lefttopBaseY + i * spacing * h),
      rightY: Array.from({length: 5}, (_, i) => rightBaseY + i * spacing * h),
      rightYTop: Array.from({length: 3}, (_, i) => righttopBaseY + i * spacing * h),
      rightXTop: 0.93 * w,
      leftX: isMobile ? 0.07 * w : 0.045 * w,
      leftXTop: isMobile ? 0.11 * w : 0.08 * w,
      rightX: isMobile ? 0.93 * w : 0.965 * w,
      agentXOffset: isMobile ? -0.18 * w : -0.21 * w,
      fortXOffset: isMobile ? 0.13 * w : 0.08 * w,
      scale,
      isMobile,
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

  // Responsive resize with devicePixelRatio for crispness
  const resize = () => {
    const w = wrapperRef.current.clientWidth;
    // Use min/max for mobile friendliness
    const h = Math.max(140, Math.min(w / CANVAS_RATIO, 320));
    const c = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    c.width = w * dpr;
    c.height = h * dpr;
    c.style.width = w + 'px';
    c.style.height = h + 'px';
  };

  useLayoutEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // Use devicePixelRatio for crispness
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Font sizes scale with width for mobile
    ctx.font = `bold ${Math.max(11, Math.round(canvas.width / (80 * dpr)))}px Inter, sans-serif`;
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
      const layout = getLayout(WIDTH / dpr, HEIGHT / dpr);
      const centreX = WIDTH / (2 * dpr);
      const agent = { x: centreX + layout.agentXOffset, y: HEIGHT / dpr / 2 - 0.19 * HEIGHT / dpr };
      const fort = { x: centreX + layout.fortXOffset, y: HEIGHT / dpr / 2 - 0.19 * HEIGHT / dpr };

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
        const grad = ctx.createLinearGradient(x, y, x + w, y + h);
        grad.addColorStop(0, "#e0f2fe"); // light blue
        grad.addColorStop(1, "#bae6fd"); // slightly deeper blue
        ctx.fillStyle = grad;

        ctx.globalAlpha = 0.85;
        ctx.shadowColor = "rgba(255, 255, 255, 0.25)";
        ctx.shadowBlur = 12 * layout.scale; // scale shadow for mobile

        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 12 * layout.scale);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = textColor;
        ctx.font = `bold ${Math.max(14, Math.round(18 * layout.scale))}px Inter, sans-serif`;
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
        ctx.lineWidth = 2.5 * layout.scale;
        ctx.beginPath();
        ctx.moveTo(-8 * layout.scale, 4 * layout.scale);
        ctx.lineTo(0, 0);
        ctx.lineTo(-8 * layout.scale, -4 * layout.scale);
        ctx.stroke();
        ctx.restore();
      };

      const curve = (p0, p1, p2, c0, c1, width = 1.5) => {
        ctx.save();
        const grad = ctx.createLinearGradient(p0.x, p0.y, p2.x, p2.y);
        grad.addColorStop(0, c0);
        grad.addColorStop(1, c1);
        ctx.strokeStyle = grad;
        ctx.lineWidth = width * layout.scale;
        ctx.shadowColor = c1;
        ctx.shadowBlur = 8 * layout.scale; // reduced blur for performance
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
        ctx.save();
        ctx.beginPath();
        ctx.arc(layout.leftX, yy, INTEGRATION_RADIUS * WIDTH / dpr, 0, 2 * Math.PI); // restore / dpr
        ctx.closePath();
        ctx.clip();
        if (img && img.complete) {
          // Center and cover the image in the circle
          const size = INTEGRATION_IMG_SIZE * WIDTH / dpr;
          const cx = layout.leftX;
          const cy = yy;
          ctx.drawImage(
            img,
            cx - size / 2,
            cy - size / 2,
            size,
            size
          );
        }
        ctx.restore();
      });
      // Draw integration images (left, top layer, offset)
      layout.leftYTop.forEach((yy, i) => {
        const img = imageCache[leftIntegrationImagesTop[i]];
        ctx.save();
        ctx.beginPath();
        ctx.arc(layout.leftXTop, yy, INTEGRATION_TOP_RADIUS * WIDTH / dpr, 0, 2 * Math.PI); // restore / dpr
        ctx.closePath();
        ctx.clip();
        if (img && img.complete) {
          const size = INTEGRATION_TOP_IMG_SIZE * WIDTH / dpr;
          const cx = layout.leftXTop;
          const cy = yy;
          ctx.drawImage(
            img,
            cx - size / 2,
            cy - size / 2,
            size,
            size
          );
        }
        ctx.restore();
      });
      // Draw integration images (right, bottom layer)
      layout.rightY.forEach((yy, i) => {
        const img = imageCache[rightIntegrationImages[i]];
        ctx.save();
        ctx.beginPath();
        ctx.arc(layout.rightX, yy, INTEGRATION_RADIUS * WIDTH / dpr, 0, 2 * Math.PI); // restore / dpr
        ctx.closePath();
        ctx.clip();
        if (img && img.complete) {
          const size = INTEGRATION_IMG_SIZE * WIDTH / dpr;
          const cx = layout.rightX;
          const cy = yy;
          ctx.drawImage(
            img,
            cx - size / 2,
            cy - size / 2,
            size,
            size
          );
        }
        ctx.restore();
      });
      // Draw integration images (right, top layer, offset)
      layout.rightYTop.forEach((yy, i) => {
        const img = imageCache[rightIntegrationImagesTop[i]];
        ctx.save();
        ctx.beginPath();
        ctx.arc(layout.rightXTop, yy, INTEGRATION_TOP_RADIUS * WIDTH / dpr, 0, 2 * Math.PI); // restore / dpr
        ctx.closePath();
        ctx.clip();
        if (img && img.complete) {
          const size = INTEGRATION_TOP_IMG_SIZE * WIDTH / dpr;
          const cx = layout.rightXTop;
          const cy = yy;
          ctx.drawImage(
            img,
            cx - size / 2,
            cy - size / 2,
            size,
            size
          );
        }
        ctx.restore();
      });

      // ------------------------ pipes ------------------------------- //
      // Left (bottom) layer arrows
      layout.leftY.forEach((yy) => {
        // Use fractional start X for responsiveness
        const leftArrowStartX = leftArrowStartXFrac * WIDTH / dpr;
        const p0 = new Vector2(leftArrowStartX, yy);
        const p1 = new Vector2(
          agent.x - (layout.isMobile ? 40 : 70) * layout.scale,
          yy - (layout.isMobile ? 0.22 : 0.13) * HEIGHT / dpr
        );
        const p2 = new Vector2(
          agent.x,
          agent.y
        );
        curve(p0, p1, p2, "#0891b2", "#06b6d4"); // cyan
      });
      // Middle arrow (agent to fort) with global endpoint control
      // Use fractional X for start/end
      const agentToFortStartX = AGENT_TO_FORT_ARROW_START_X_FRAC * WIDTH / dpr;
      const agentToFortEndX = AGENT_TO_FORT_ARROW_END_X_FRAC * WIDTH / dpr;
      const agentToFortStart = { x: agentToFortStartX, y: agent.y };
      const agentToFortEnd = { x: agentToFortEndX, y: fort.y };
      const midControlX = (agentToFortStart.x + agentToFortEnd.x) / 2;
      const midControlY = Math.min(agent.y, fort.y) - (layout.isMobile ? 0.19 : 0.11) * HEIGHT / dpr;
      // Define fortBoxW here for use in right arrows
      const fortBoxW = CONTEXTFORT_BOX_WIDTH * WIDTH / dpr * (layout.isMobile ? 0.85 : 1);
      curve(
        new Vector2(agentToFortStart.x, agentToFortStart.y),
        new Vector2(midControlX, midControlY),
        new Vector2(agentToFortEnd.x, agentToFortEnd.y),
        "#7c3aed",
        "#8b5cf6",
        layout.isMobile ? 2.2 : 2.7,
      );
      // Right (bottom) layer arrows (ContextFort to right integrations)
      layout.rightY.forEach((yy) => {
        // Use fractional start X for responsiveness
        const rightArrowStartX = rightArrowStartXFrac * WIDTH / dpr;
        const fortBoxPadR = fortBoxW * 0.52;
        const startX = fort.x + fortBoxPadR;
        const startY = fort.y;
        const arrowCurve = layout.isMobile ? 0.22 : 0.13;
        const p0 = new Vector2(startX, startY);
        const p1 = new Vector2(rightArrowStartX - (layout.isMobile ? 40 : 70) * layout.scale, yy - arrowCurve * HEIGHT / dpr);
        const p2 = new Vector2(rightArrowStartX, yy);
        curve(p0, p1, p2, "#ea580c", "#f97316"); // orange
      });
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
            const leftArrowStartX = leftArrowStartXFrac * WIDTH / dpr;
            const arrowCurve = layout.isMobile ? 0.22 : 0.13;
            p0 = { x: leftArrowStartX, y: layout.leftY[state.lane] };
            p1 = { x: agent.x - (layout.isMobile ? 40 : 70) * layout.scale, y: layout.leftY[state.lane] - arrowCurve * HEIGHT / dpr };
            p2 = { x: agent.x, y: agent.y };
            ({ x, y } = bezierPt(state.t, p0, p1, p2));
          } else if (state.stage === 1) {
            // Middle arrow: agent to ContextFort (use fractional X)
            const agentToFortStartX = AGENT_TO_FORT_ARROW_START_X_FRAC * WIDTH / dpr;
            const agentToFortEndX = AGENT_TO_FORT_ARROW_END_X_FRAC * WIDTH / dpr;
            const start = { x: agentToFortStartX, y: agent.y };
            const end = { x: agentToFortEndX, y: fort.y };
            const midControlX = (start.x + end.x) / 2;
            const midControlY = Math.min(agent.y, fort.y) - (layout.isMobile ? 0.19 : 0.11) * HEIGHT / dpr;
            p0 = start;
            p1 = { x: midControlX, y: midControlY };
            p2 = end;
            ({ x, y } = bezierPt(state.t, p0, p1, p2));
          } else if (state.stage === 2 && !conf.devillish) {
            // Right arrow: ContextFort to right integration (use fractional X)
            const rightArrowStartX = rightArrowStartXFrac * WIDTH / dpr;
            const fortBoxW = CONTEXTFORT_BOX_WIDTH * WIDTH / dpr * (layout.isMobile ? 0.85 : 1);
            const fortBoxPadR = fortBoxW * 0.52;
            const startX = fort.x + fortBoxPadR;
            const startY = fort.y;
            const arrowCurve = layout.isMobile ? 0.22 : 0.13;
            p0 = { x: startX, y: startY };
            p1 = { x: rightArrowStartX - (layout.isMobile ? 40 : 70) * layout.scale, y: layout.rightY[state.lane] - arrowCurve * HEIGHT / dpr };
            p2 = { x: rightArrowStartX, y: layout.rightY[state.lane] };
            ({ x, y } = bezierPt(state.t, p0, p1, p2));
          } else if (state.stage === 2 && conf.devillish) {
            x = (DEVIL_DROP_X > 0 ? DEVIL_DROP_X * WIDTH / dpr : fort.x + 60 * layout.scale);
            y = fort.y + (typeof DEVIL_DROP_OFFSET_Y === 'number' ? state.t * DEVIL_DROP_OFFSET_Y * layout.scale : state.t * 120 * layout.scale);
          } else if (state.stage === 3 && conf.devillish) {
            x = (DEVIL_DROP_X > 0 ? DEVIL_DROP_X * WIDTH / dpr : fort.x + 60 * layout.scale);
            y = fort.y + (typeof DEVIL_DROP_OFFSET_Y === 'number' ? DEVIL_DROP_OFFSET_Y * layout.scale : 120 * layout.scale) + state.t * 40 * layout.scale;
          }
          if (state.running && typeof x === 'number' && typeof y === 'number') {
            ctx.save();
            ctx.font = `${Math.max(layout.isMobile ? 10 : 11, Math.round((layout.isMobile ? 12 : 14) * layout.scale))}px Inter, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            if (conf.devillish) {
                ctx.globalAlpha = state.stage === 3 ? 1 - state.t : 1;
                const img = imageCache[DEVIL_IMG];
                if (img && img.complete) {
                const iconOffsetX = (layout.isMobile ? 80 : 115) * layout.scale;
                const iconSize = (layout.isMobile ? 20 : 28) * layout.scale;
                const iconCenterX = x - iconOffsetX;
                const iconCenterY = y;

                if (state.stage >= 2) {
                    ctx.save();
                    ctx.translate(iconCenterX, iconCenterY); // move origin to icon center
                    ctx.rotate(state.t * 0.8);               // spin around its center
                    ctx.drawImage(img, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
                    ctx.restore();
                } else {
                    ctx.drawImage(img, iconCenterX - iconSize / 2, iconCenterY - iconSize / 2, iconSize, iconSize);
                }
                }
            }

            ctx.fillStyle = conf.color;
            ctx.shadowColor = conf.color;
            ctx.shadowBlur = 6 * layout.scale;

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
      drawSolidBox(
        agent.x,
        agent.y - 0.055 * HEIGHT / dpr,
        CONTEXTFORT_BOX_WIDTH * WIDTH / dpr * (layout.isMobile ? 0.85 : 1),
        CONTEXTFORT_BOX_HEIGHT * HEIGHT / dpr * (layout.isMobile ? 0.85 : 1),
        "Agent",
        AGENT_BOX_COLOR,
        AGENT_TEXT_COLOR
      );
      drawSolidBox(
        fort.x,
        fort.y - 0.055 * HEIGHT / dpr,
        CONTEXTFORT_BOX_WIDTH * WIDTH / dpr * (layout.isMobile ? 0.85 : 1),
        CONTEXTFORT_BOX_HEIGHT * HEIGHT / dpr * (layout.isMobile ? 0.85 : 1),
        "ContextFort",
        AGENT_BOX_COLOR,
        AGENT_TEXT_COLOR
      );
      ctx.save();
      ctx.font = `bold ${Math.max(layout.isMobile ? 12 : 14, Math.round((layout.isMobile ? 14 : 18) * layout.scale))}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = AGENT_TEXT_COLOR;
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 2 * layout.scale;
      ctx.shadowBlur = 0;
      ctx.restore();

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
        minHeight: 140,
        maxHeight: 320,
        width: '100%',
        left: diagramX,
        top: diagramY,
        position: 'relative',
        touchAction: 'manipulation', // improve mobile touch
        overflow: 'hidden', // prevent scrollbars on mobile
      }}
    >
      <canvas ref={canvasRef} className="rounded-xl shadow-2xl w-full h-full" style={{ background: 'transparent', width: '100%', height: '100%', display: 'block', touchAction: 'manipulation' }} />
    </div>
  );
};
