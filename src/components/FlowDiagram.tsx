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
  agentImages,
  leftArrowStartXFrac,
  rightArrowStartXFrac,
  AGENT_TO_FORT_ARROW_START_X_FRAC,
  AGENT_TO_FORT_ARROW_END_X_FRAC,
  diagramX,
  diagramY,
  DEVIL_IMG,
  movingTexts,
  TEXT_SPEED,
  INTEGRATION_RADIUS,
  INTEGRATION_IMG_SIZE,
  INTEGRATION_TOP_RADIUS,
  INTEGRATION_TOP_IMG_SIZE,
  INTEGRATION_SPACING,
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
  const raf = useRef<number | undefined>(undefined);

  // Responsive layout helpers
  const getScale = (w: number, h: number) => {
    // Allow scale to go below 1 for mobile, but not below 0.5
    return Math.max(0.5, Math.min(w / BASE_WIDTH, h / BASE_HEIGHT));
  };

  // Responsive positions (all as fractions of width/height)
  const getLayout = React.useCallback((w: number, h: number) => {
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
  }, []);

  // FlowObject definition with placement and rendering logic
  type FlowArrow = 'left' | 'middle' | 'right' | 'down';

  interface FlowObjectConfig {
    label: string;
    color: string;
    icon: string; // URL to logo/icon
    arrow: FlowArrow;
    t: number; // 0 to 1, how far along the arrow
    devilish?: boolean;
  }

  // Dummy objects for demo
  const flowObjects = React.useMemo(() => {
    class LocalFlowObject {
      label: string;
      color: string;
      icon: string;
      arrow: FlowArrow;
      t: number;
      devilish: boolean;
      constructor(cfg: FlowObjectConfig) {
        this.label = cfg.label;
        this.color = cfg.color;
        this.icon = cfg.icon;
        this.arrow = cfg.arrow;
        this.t = cfg.t;
        this.devilish = !!cfg.devilish;
      }
    }
    return [
      new LocalFlowObject({
        label: 'Messages',
        color: '#f59e42',
        icon: leftIntegrationImages[0],
        arrow: 'left',
        t: 0.5,
      }),
      new LocalFlowObject({
        label: 'Events',
        color: '#36c5f0',
        icon: leftIntegrationImages[1],
        arrow: 'left',
        t: 0.2,
      }),
      new LocalFlowObject({
        label: 'Leak Calendar',
        color: '#ef4444',
        icon: rightIntegrationImages[2],
        arrow: 'left',
        t: 0.5,
        devilish: true,
      }),
      new LocalFlowObject({
        label: 'Issues',
        color: 'black',
        icon: leftIntegrationImages[2],
        arrow: 'left',
        t: 0.2,
      }),
      new LocalFlowObject({
        label: 'Any Tool Call',
        color: '#a78bfa',
        icon: agentImages[0],
        arrow: 'middle',
        t: 0.5,
      }),
      new LocalFlowObject({
        label: 'New Metric Post',
        color: 'purple',
        icon: rightIntegrationImages[0],
        arrow: 'right',
        t: 0.2,
      }),
      new LocalFlowObject({
        label: 'Create Doc',
        color: '#000',
        icon: rightIntegrationImages[1],
        arrow: 'right',
        t: 0.7,
      }),
      new LocalFlowObject({
        label: 'Close Ticket',
        color: 'darkblue',
        icon: rightIntegrationImages[4],
        arrow: 'right',
        t: 0.55,
      }),
      new LocalFlowObject({
        label: 'Blocked Tool Call',
        color: '#ef4444',
        icon: DEVIL_IMG,
        arrow: 'down',
        t: 0.5,
        devilish: true,
      }),
    ];
  }, []);

  /* ------------------------- layout constants ------------------------ */

  // Responsive resize with devicePixelRatio for crispness
  const resize = () => {
    const w = wrapperRef.current.clientWidth;
    const h = wrapperRef.current.clientHeight; // Use actual wrapper height
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
      ...agentImages,
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
      const agent = { x: centreX + layout.agentXOffset, y: HEIGHT / dpr / 2 - 0.09 * HEIGHT / dpr };
      const fort = { x: centreX + layout.fortXOffset, y: HEIGHT / dpr / 2 - 0.09 * HEIGHT / dpr };

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
      layout.leftY.forEach((yy, i) => {
        // Use fractional start X for responsiveness
        const leftArrowStartX = leftArrowStartXFrac * WIDTH / dpr;
        const p0 = new Vector2(leftArrowStartX, yy);
        const p1 = new Vector2(
          agent.x - (layout.isMobile ? 40 : 70) * layout.scale,
          yy - (layout.isMobile ? 0.22 : 0.13) * HEIGHT / dpr
        );
        // Stagger the right endpoint vertically so arrowheads don't overlap
        const arrowCount = layout.leftY.length;
        const ySpread = 12 * layout.scale;
        const p2 = new Vector2(
          agent.x - 16 * layout.scale, // half the previous x offset
          agent.y + ((i - (arrowCount - 1) / 2) * ySpread)
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
        const fortBoxPadR = fortBoxW * 0.78;
        const startX = fort.x + fortBoxPadR;
        const startY = fort.y;
        const arrowCurve = layout.isMobile ? 0.22 : 0.13;
        const p0 = new Vector2(startX, startY);
        const p1 = new Vector2(rightArrowStartX - (layout.isMobile ? 40 : 70) * layout.scale, yy - arrowCurve * HEIGHT / dpr);
        const p2 = new Vector2(rightArrowStartX, yy);
        curve(p0, p1, p2, "#ea580c", "#f97316"); // orange
      });

      // Draw static objects on arrows
      // Helper to draw a static object (circle with label)
      function drawFlowObject(obj, x, y, size) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = obj.color;
        ctx.globalAlpha = 0.92;
        ctx.shadowColor = obj.color;
        ctx.shadowBlur = 8 * layout.scale;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${Math.max(11, Math.round(13 * layout.scale))}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(obj.label, x, y);
        ctx.restore();
      }
      // Helper to draw a rectangular flow object with logo partially out
      function drawFlowObjectRect(
        obj: {
          label: string;
          color: string;
          icon: string;
          arrow: string;
          t: number;
          devilish?: boolean;
        },
        x: number,
        y: number,        
        w: number,
        h: number,
        iconImg: HTMLImageElement | undefined
      ) {
        ctx.save();
        // Reduce font and icon size for flow objects
        const fontSize = layout.isMobile ? Math.max(7, Math.round(8.5 * layout.scale)) : Math.max(9, Math.round(11 * layout.scale));
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const textWidth = ctx.measureText(obj.label).width;
        const minTextPad = h * (layout.isMobile ? 0.45 : 0.6) + (layout.isMobile ? 6 : 10) * layout.scale;
        const neededW = textWidth + minTextPad;
        if (neededW > w) {
          w = neededW;
        }
        // Draw red glow for devilish
        if (obj.devilish) {
          ctx.save();
          ctx.shadowColor = '#ff1a1a';
          ctx.shadowBlur = 24 * layout.scale;
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          const radius = 6 * layout.scale;
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + w - radius, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
          ctx.lineTo(x + w, y + h - radius);
          ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
          ctx.lineTo(x + radius, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.fillStyle = obj.color;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
          ctx.restore();
        }
        // Draw rounded rectangle
        ctx.beginPath();
        const radius = 6 * layout.scale;
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fillStyle = obj.color;
        ctx.globalAlpha = 0.96;
        ctx.shadowColor = obj.color;
        ctx.shadowBlur = 6 * layout.scale;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        // Draw icon as a full circle, mostly outside top left
        if (iconImg && iconImg.complete && iconImg.naturalWidth > 0) {
          const iconSize = h * 0.7;
          ctx.save();
          ctx.beginPath();
          ctx.arc(x - iconSize * 0.35, y - iconSize * 0.35, iconSize * 0.5, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(iconImg, x - iconSize * 0.85, y - iconSize * 0.85, iconSize, iconSize);
          ctx.restore();
        }
        // Draw label text
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(obj.label, x + h * 0.6, y + h / 2);
        ctx.restore();
      }

      // Draw all flow objects based on their arrow and t
      flowObjects.forEach((obj) => {
        let pt;
        // Reduce box and font size for flow objects
        const w = 68 * layout.scale, h = 26 * layout.scale;
        const iconImg = imageCache[obj.icon];
        if (obj.arrow === 'left') {
          const i = flowObjects.filter(o => o.arrow === 'left').indexOf(obj);
          const leftArrowStartX = leftArrowStartXFrac * WIDTH / dpr;
          const p0 = { x: leftArrowStartX, y: layout.leftY[i] };
          const p1 = { x: agent.x - 70 * layout.scale, y: layout.leftY[i] - 0.13 * HEIGHT / dpr };
          // Stagger the right endpoint vertically to match the arrow
          const arrowCount = layout.leftY.length;
          const ySpread = 12 * layout.scale;
          const p2 = { x: agent.x - 16 * layout.scale, y: agent.y + ((i - (arrowCount - 1) / 2) * ySpread) };
          pt = bezierPt(obj.t, p0, p1, p2);
        } else if (obj.arrow === 'middle') {
          const agentToFortStartX = AGENT_TO_FORT_ARROW_START_X_FRAC * WIDTH / dpr;
          const agentToFortEndX = AGENT_TO_FORT_ARROW_END_X_FRAC * WIDTH / dpr;
          const start = { x: agentToFortStartX, y: agent.y };
          const end = { x: agentToFortEndX, y: fort.y };
          const midControlX = (start.x + end.x) / 2;
          const midControlY = Math.min(agent.y, fort.y) - 0.11 * HEIGHT / dpr;
          pt = bezierPt(obj.t, start, { x: midControlX, y: midControlY }, end);
        } else if (obj.arrow === 'right') {
          const i = flowObjects.filter(o => o.arrow === 'right').indexOf(obj);
          const rightArrowStartX = rightArrowStartXFrac * WIDTH / dpr;
          const fortBoxW = CONTEXTFORT_BOX_WIDTH * WIDTH / dpr * (layout.isMobile ? 0.85 : 1);
          const fortBoxPadR = fortBoxW * 0.52;
          const startX = fort.x + fortBoxPadR;
          const startY = fort.y;
          const p0 = { x: startX, y: startY };
          const p1 = { x: rightArrowStartX - 70 * layout.scale, y: layout.rightY[i] - 0.13 * HEIGHT / dpr };
          const p2 = { x: rightArrowStartX, y: layout.rightY[i] };
          pt = bezierPt(obj.t, p0, p1, p2);
        } else if (obj.arrow === 'down') {
          const downStart = { x: fort.x + CONTEXTFORT_BOX_WIDTH * WIDTH / dpr * 0.5, y: fort.y + CONTEXTFORT_BOX_HEIGHT * HEIGHT / dpr };
          const downEnd = { x: downStart.x, y: downStart.y + 60 * layout.scale };
          pt = {
            x: downStart.x * (1 - obj.t) + downEnd.x * obj.t,
            y: downStart.y * (1 - obj.t) + downEnd.y * obj.t,
          };
        }
        if (pt) drawFlowObjectRect(obj, pt.x - w / 2, pt.y - h / 2, w, h, iconImg);
      });

      // === Draw agent and fort boxes last so they are always on top ===
      // Use website-matching color for the boxes (e.g. #f8fafc for bg, #0f172a for text)
      const AGENT_BOX_COLOR = "#f8fafc"; // light background
      const AGENT_TEXT_COLOR = "#0f172a"; // dark text
      const agentBoxW = CONTEXTFORT_BOX_WIDTH * WIDTH / dpr * (layout.isMobile ? 0.85 : 1);
      const agentBoxH = CONTEXTFORT_BOX_HEIGHT * HEIGHT / dpr * (layout.isMobile ? 0.85 : 1);
      // Draw Agent box
      drawSolidBox(
        agent.x,
        agent.y - 0.055 * HEIGHT / dpr,
        agentBoxW,
        agentBoxH,
        "Agent",
        AGENT_BOX_COLOR,
        AGENT_TEXT_COLOR
      );
      // Draw Fort box (ContextFort)
      drawSolidBox(
        fort.x,
        fort.y - 0.055 * HEIGHT / dpr,
        CONTEXTFORT_BOX_WIDTH * WIDTH / dpr * (layout.isMobile ? 0.85 : 1),
        CONTEXTFORT_BOX_HEIGHT * HEIGHT / dpr * (layout.isMobile ? 0.85 : 1),
        "ContextFort",
        AGENT_BOX_COLOR,
        AGENT_TEXT_COLOR
      );
      // Draw 'Retrieve Context' (top left inside Agent box)
      ctx.save();
      ctx.font = `bold ${Math.max(layout.isMobile ? 9 : 10, Math.round((layout.isMobile ? 10 : 12) * layout.scale))}px Inter, sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = AGENT_TEXT_COLOR;
      ctx.globalAlpha = 0.85;
      ctx.fillText("Retrieve Context", agent.x + 10 * layout.scale, agent.y - 0.055 * HEIGHT / dpr + 8 * layout.scale);
      ctx.restore();
      // Draw 'Perform Actions' (bottom right inside Agent box)
      ctx.save();
      ctx.font = `bold ${Math.max(layout.isMobile ? 9 : 10, Math.round((layout.isMobile ? 10 : 12) * layout.scale))}px Inter, sans-serif`;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = AGENT_TEXT_COLOR;
      ctx.globalAlpha = 0.85;
      ctx.fillText("Perform Actions", agent.x + agentBoxW - 10 * layout.scale, agent.y - 0.055 * HEIGHT / dpr + agentBoxH - 8 * layout.scale);
      ctx.restore();
      // Draw VSCode, windsurf, and Cursor logos below Agent box (horizontal)
      const logoY = agent.y - 0.055 * HEIGHT / dpr + agentBoxH + 18 * layout.scale;
      const logoSize = 28 * layout.scale;
      const logoGap = 18 * layout.scale;
      const logoStartX = agent.x + agentBoxW / 2 - 1.5 * logoSize - logoGap;

      // Get images from agentImages
      const [vscodeImg, cursorImg, windsurfImg] = [
        imageCache[agentImages[0]],
        imageCache[agentImages[1]],
        imageCache[agentImages[2]],
      ];

      // Helper to draw an image as a circle (for avatars/logos)
      function drawCircleImage(img, x, y, size) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
      }

      // VSCode
      if (vscodeImg && vscodeImg.complete && vscodeImg.naturalWidth > 0) {
        drawCircleImage(vscodeImg, logoStartX, logoY, logoSize);
      } else {
        ctx.save();
        ctx.fillStyle = "#0078D4";
        ctx.beginPath();
        ctx.arc(logoStartX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }
      // Windsurf
      if (windsurfImg && windsurfImg.complete && windsurfImg.naturalWidth > 0) {
        drawCircleImage(windsurfImg, logoStartX + logoSize + logoGap, logoY, logoSize);
      } else {
        ctx.save();
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(logoStartX + logoSize + logoGap + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }
      // Cursor
      if (cursorImg && cursorImg.complete && cursorImg.naturalWidth > 0) {
        drawCircleImage(cursorImg, logoStartX + 2 * (logoSize + logoGap), logoY, logoSize);
      } else {
        ctx.save();
        ctx.fillStyle = "#888";
        ctx.beginPath();
        ctx.arc(logoStartX + 2 * (logoSize + logoGap) + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [getLayout, flowObjects]);

  return (
    <div
      ref={wrapperRef}
      className="w-full max-w-full aspect-[900/320] sm:aspect-[900/320]"
      style={{
        minHeight: 140,
        maxHeight: 320,
        width: '100%',
        // left: diagramX, // Remove left
        // top: diagramY,  // Remove top
        position: 'relative',
        touchAction: 'manipulation', // improve mobile touch
        overflow: 'hidden', // prevent scrollbars on mobile
      }}
    >
      <canvas ref={canvasRef} className="rounded-xl shadow-2xl w-full h-full" style={{ background: 'transparent', width: '100%', height: '100%', display: 'block', touchAction: 'manipulation' }} />
    </div>
  );
};
