import React, { useRef, useEffect } from "react";
import { Vector2 } from "three";
import {
  leftIntegrationImages,
  leftIntegrationImagesTop,
  rightIntegrationImages,
  rightIntegrationImagesTop,
  agentImages,
  leftArrowStartXFrac,
  rightArrowStartXFrac,
  AGENT_TO_FORT_ARROW_START_X_FRAC,
  AGENT_TO_FORT_ARROW_END_X_FRAC,
  DEVIL_IMG,
  INTEGRATION_RADIUS,
  INTEGRATION_IMG_SIZE,
  INTEGRATION_TOP_RADIUS,
  INTEGRATION_TOP_IMG_SIZE,
  INTEGRATION_SPACING,
  CONTEXTFORT_BOX_WIDTH,
  CONTEXTFORT_BOX_HEIGHT,
} from './FlowDiagram.constants';
import { bezierPt } from './FlowDiagram.helpers';
import { drawSolidBox, curve, drawCircleImage, drawFlowObjectRect } from './FlowDiagram.drawing';
import { FlowObject } from './FlowDiagram.flowObjects';
import { useCanvasOptimization } from "../hooks/use-canvas-optimization";
import { getPreloadedImage } from "../lib/preload";
import { memoize } from "../lib/optimization";

/**************************************************************************
 *  FlowDiagram – redesigned visuals with optimized performance
 **************************************************************************/
export const FlowDiagram = () => {
  // Responsive base dimensions
  const BASE_WIDTH = 900;
  const BASE_HEIGHT = 320;

  // Use the optimized canvas hook
  const {
    elementRef: canvasRef,
    isInViewport,
    isScrolling,
    isHeavyScrolling,
    scrollClass,
    dimensions,
    startAnimation,
    stopAnimation,
    getEffectiveDpr
  } = useCanvasOptimization({
    frameThreshold: 100,  // ~10 FPS when scrolling
    frameLimiter: 6,      // Increased to render even fewer frames during scroll
    rootMargin: '300px',  // Start preparing earlier
    dprLimit: 1.0,        // Reduced to improve performance
  });
  
  const wrapperRef = useRef(null);
  const imageCache = useRef<Record<string, HTMLImageElement>>({});

  // Responsive layout helpers
  const getScale = (w: number, h: number) => {
    // Allow scale to go below 1 for mobile, but not below 0.5
    return Math.max(0.5, Math.min(w / BASE_WIDTH, h / BASE_HEIGHT));
  };

  // Responsive positions (all as fractions of width/height)
  const getLayout = React.useCallback((w: number, h: number) => {
    return memoize(`layout-${w}-${h}`, () => {
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
    }, 10000); // Cache layout for 10 seconds
  }, []);

  // Dummy objects for demo - memoized
  const flowObjects = React.useMemo(() => {
    return [
      new FlowObject({
        label: 'Messages',
        color: '#f59e42',
        icon: leftIntegrationImages[0],
        arrow: 'left',
        t: 0.5,
      }),
      new FlowObject({
        label: 'Events',
        color: '#36c5f0',
        icon: leftIntegrationImages[1],
        arrow: 'left',
        t: 0.2,
      }),
      new FlowObject({
        label: 'Leak Calendar',
        color: '#f59e0b', // amber-500
        icon: rightIntegrationImages[2],
        arrow: 'left',
        t: 0.5,
        devilish: true,
      }),
      new FlowObject({
        label: 'Issues',
        color: 'black',
        icon: leftIntegrationImages[2],
        arrow: 'left',
        t: 0.2,
      }),
      new FlowObject({
        label: 'Any Tool Call',
        color: '#a78bfa',
        icon: agentImages[0],
        arrow: 'middle',
        t: 0.5,
      }),
      new FlowObject({
        label: 'New Metric Post',
        color: 'purple',
        icon: rightIntegrationImages[0],
        arrow: 'right',
        t: 0.2,
      }),
      new FlowObject({
        label: 'Create Doc',
        color: '#000',
        icon: rightIntegrationImages[1],
        arrow: 'right',
        t: 0.7,
      }),
      new FlowObject({
        label: 'Close Ticket',
        color: 'darkblue',
        icon: rightIntegrationImages[4],
        arrow: 'right',
        t: 0.55,
      }),
      new FlowObject({
        label: 'Blocked Tool Call',
        color: '#ef4444',
        icon: DEVIL_IMG,
        arrow: 'down',
        t: 0.5,
        devilish: true,
      }),
    ];
  }, []);

  // Preload images once
  useEffect(() => {
    const allImages = [
      ...leftIntegrationImages,
      ...leftIntegrationImagesTop,
      ...rightIntegrationImages,
      ...rightIntegrationImagesTop,
      ...agentImages,
      DEVIL_IMG,
    ];
    
    allImages.forEach((url) => {
      // Try to get preloaded image first
      const preloadedImg = getPreloadedImage(url);
      if (preloadedImg) {
        imageCache.current[url] = preloadedImg;
      } else if (!imageCache.current[url]) {
        const img = new window.Image();
        img.src = url;
        imageCache.current[url] = img;
      }
    });
  }, []);

  // Helper to draw a logo or fallback circle (define once)
  function drawLogoOrFallback(ctx, img, fallbackColor, x, y, size) {
    if (img && img.complete && img.naturalWidth > 0) {
      drawCircleImage(ctx, img, x, y, size);
    } else {
      ctx.save();
      ctx.fillStyle = fallbackColor;
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }
  }

  const logoConfigs = [
    { key: 'vscode', imgKey: agentImages[0], color: "#0078D4" },
    { key: 'windsurf', imgKey: agentImages[2], color: "#38bdf8" },
    { key: 'cursor', imgKey: agentImages[1], color: "#888" },
  ];

  // Main rendering function
  const renderCanvas = (ctx, timestamp, { width, height }) => {
    const effectiveDpr = getEffectiveDpr();
    const WIDTH = width;
    const HEIGHT = height;
    
    // Apply DPR transform
    ctx.setTransform(effectiveDpr, 0, 0, effectiveDpr, 0, 0);
    
    // Get layout based on current dimensions
    const layout = getLayout(WIDTH / effectiveDpr, HEIGHT / effectiveDpr);
    const centreX = WIDTH / (2 * effectiveDpr);
    const agent = { 
      x: centreX + layout.agentXOffset, 
      y: HEIGHT / effectiveDpr / 2 - 0.09 * HEIGHT / effectiveDpr 
    };
    const fort = { 
      x: centreX + layout.fortXOffset, 
      y: HEIGHT / effectiveDpr / 2 - 0.09 * HEIGHT / effectiveDpr 
    };
    
    // Skip complex rendering during heavy scrolling
    const simplifiedRendering = isHeavyScrolling;

    /* ------------------------------ clear --------------------------- */
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // For heavy scrolling, just draw boxes and minimal elements
    if (simplifiedRendering) {
      // Draw Agent box (simplified)
      const agentBoxW = CONTEXTFORT_BOX_WIDTH * WIDTH / effectiveDpr * (layout.isMobile ? 0.85 : 1);
      const agentBoxH = CONTEXTFORT_BOX_HEIGHT * HEIGHT / effectiveDpr * (layout.isMobile ? 0.85 : 1);
      const AGENT_BOX_COLOR = "#f8fafc";
      const AGENT_TEXT_COLOR = "#334155";
      
      drawSolidBox(
        ctx,
        agent.x,
        agent.y - 0.055 * HEIGHT / effectiveDpr,
        agentBoxW,
        agentBoxH,
        "Agent",
        AGENT_BOX_COLOR,
        AGENT_TEXT_COLOR,
        layout
      );
      
      // Draw Fort box (ContextFort) - simplified
      drawSolidBox(
        ctx,
        fort.x,
        fort.y - 0.055 * HEIGHT / effectiveDpr,
        CONTEXTFORT_BOX_WIDTH * WIDTH / effectiveDpr * (layout.isMobile ? 0.85 : 1),
        CONTEXTFORT_BOX_HEIGHT * HEIGHT / effectiveDpr * (layout.isMobile ? 0.85 : 1),
        "ContextFort",
        AGENT_BOX_COLOR,
        AGENT_TEXT_COLOR,
        layout
      );
      
      return; // Skip the rest of the rendering
    }

    /* -------------------- static node drawing ---------------------- */
    // Draw integration images (left, bottom layer)
    layout.leftY.forEach((yy, i) => {
      const img = imageCache.current[leftIntegrationImages[i]];
      ctx.save();
      ctx.beginPath();
      ctx.arc(layout.leftX, yy, INTEGRATION_RADIUS * WIDTH / effectiveDpr, 0, 2 * Math.PI); // restore / dpr
      ctx.closePath();
      ctx.clip();
      if (img && img.complete) {
        // Center and cover the image in the circle
        const size = INTEGRATION_IMG_SIZE * WIDTH / effectiveDpr;
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
      const img = imageCache.current[leftIntegrationImagesTop[i]];
      ctx.save();
      ctx.beginPath();
      ctx.arc(layout.leftXTop, yy, INTEGRATION_TOP_RADIUS * WIDTH / effectiveDpr, 0, 2 * Math.PI); // restore / dpr
      ctx.closePath();
      ctx.clip();
      if (img && img.complete) {
        const size = INTEGRATION_TOP_IMG_SIZE * WIDTH / effectiveDpr;
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
      const img = imageCache.current[rightIntegrationImages[i]];
      ctx.save();
      ctx.beginPath();
      ctx.arc(layout.rightX, yy, INTEGRATION_RADIUS * WIDTH / effectiveDpr, 0, 2 * Math.PI); // restore / dpr
      ctx.closePath();
      ctx.clip();
      if (img && img.complete) {
        const size = INTEGRATION_IMG_SIZE * WIDTH / effectiveDpr;
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
      const img = imageCache.current[rightIntegrationImagesTop[i]];
      ctx.save();
      ctx.beginPath();
      ctx.arc(layout.rightXTop, yy, INTEGRATION_TOP_RADIUS * WIDTH / effectiveDpr, 0, 2 * Math.PI); // restore / dpr
      ctx.closePath();
      ctx.clip();
      if (img && img.complete) {
        const size = INTEGRATION_TOP_IMG_SIZE * WIDTH / effectiveDpr;
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
      const leftArrowStartX = leftArrowStartXFrac * WIDTH / effectiveDpr;
      const p0 = new Vector2(leftArrowStartX, yy);
      const p1 = new Vector2(
        agent.x - (layout.isMobile ? 40 : 70) * layout.scale,
        yy - (layout.isMobile ? 0.22 : 0.13) * HEIGHT / effectiveDpr
      );
      // Stagger the right endpoint vertically so arrowheads don't overlap
      const arrowCount = layout.leftY.length;
      const ySpread = 12 * layout.scale;
      const p2 = new Vector2(
        agent.x - 16 * layout.scale, // half the previous x offset
        agent.y + ((i - (arrowCount - 1) / 2) * ySpread)
      );
      curve(ctx, p0, p1, p2, "#0d9488", "#14b8a6", layout); // teal-600 to teal-500
    });
    // Middle arrow (agent to fort) with global endpoint control
    // Use fractional X for start/end
    const agentToFortStartX = AGENT_TO_FORT_ARROW_START_X_FRAC * WIDTH / effectiveDpr;
    const agentToFortEndX = AGENT_TO_FORT_ARROW_END_X_FRAC * WIDTH / effectiveDpr;
    const agentToFortStart = { x: agentToFortStartX, y: agent.y };
    const agentToFortEnd = { x: agentToFortEndX, y: fort.y };
    const midControlX = (agentToFortStart.x + agentToFortEnd.x) / 2;
    const midControlY = Math.min(agent.y, fort.y) - (layout.isMobile ? 0.19 : 0.11) * HEIGHT / effectiveDpr;
    // Define fortBoxW here for use in right arrows
    const fortBoxW = CONTEXTFORT_BOX_WIDTH * WIDTH / effectiveDpr * (layout.isMobile ? 0.85 : 1);
    curve(
      ctx,
      new Vector2(agentToFortStart.x, agentToFortStart.y),
      new Vector2(midControlX, midControlY),
      new Vector2(agentToFortEnd.x, agentToFortEnd.y),
      "#0f766e",
      "#0d9488",
      layout,
      layout.isMobile ? 2.2 : 2.7,
    );
    // Right (bottom) layer arrows (ContextFort to right integrations)
    layout.rightY.forEach((yy) => {
      // Use fractional start X for responsiveness
      const rightArrowStartX = rightArrowStartXFrac * WIDTH / effectiveDpr;
      const fortBoxPadR = fortBoxW * 0.78;
      const startX = fort.x + fortBoxPadR;
      const startY = fort.y;
      const arrowCurve = layout.isMobile ? 0.22 : 0.13;
      const p0 = new Vector2(startX, startY);
      const p1 = new Vector2(rightArrowStartX - (layout.isMobile ? 40 : 70) * layout.scale, yy - arrowCurve * HEIGHT / effectiveDpr);
      const p2 = new Vector2(rightArrowStartX, yy);
      curve(ctx, p0, p1, p2, "#475569", "#64748b", layout); // slate-600 to slate-500
    });

    // Draw all flow objects based on their arrow and t
    flowObjects.forEach((obj) => {
      let pt;
      // Reduce box and font size for flow objects
      const w = 68 * layout.scale, h = 26 * layout.scale;
      const iconImg = imageCache.current[obj.icon];
      if (obj.arrow === 'left') {
        const i = flowObjects.filter(o => o.arrow === 'left').indexOf(obj);
        const leftArrowStartX = leftArrowStartXFrac * WIDTH / effectiveDpr;
        const p0 = { x: leftArrowStartX, y: layout.leftY[i] };
        const p1 = { x: agent.x - 70 * layout.scale, y: layout.leftY[i] - 0.13 * HEIGHT / effectiveDpr };
        // Stagger the right endpoint vertically to match the arrow
        const arrowCount = layout.leftY.length;
        const ySpread = 12 * layout.scale;
        const p2 = { x: agent.x - 16 * layout.scale, y: agent.y + ((i - (arrowCount - 1) / 2) * ySpread) };
        pt = bezierPt(obj.t, p0, p1, p2);
      } else if (obj.arrow === 'middle') {
        const agentToFortStartX = AGENT_TO_FORT_ARROW_START_X_FRAC * WIDTH / effectiveDpr;
        const agentToFortEndX = AGENT_TO_FORT_ARROW_END_X_FRAC * WIDTH / effectiveDpr;
        const start = { x: agentToFortStartX, y: agent.y };
        const end = { x: agentToFortEndX, y: fort.y };
        const midControlX = (start.x + end.x) / 2;
        const midControlY = Math.min(agent.y, fort.y) - 0.11 * HEIGHT / effectiveDpr;
        pt = bezierPt(obj.t, start, { x: midControlX, y: midControlY }, end);
      } else if (obj.arrow === 'right') {
        const i = flowObjects.filter(o => o.arrow === 'right').indexOf(obj);
        const rightArrowStartX = rightArrowStartXFrac * WIDTH / effectiveDpr;
        const fortBoxW = CONTEXTFORT_BOX_WIDTH * WIDTH / effectiveDpr * (layout.isMobile ? 0.85 : 1);
        const fortBoxPadR = fortBoxW * 0.52;
        const startX = fort.x + fortBoxPadR;
        const startY = fort.y;
        const p0 = { x: startX, y: startY };
        const p1 = { x: rightArrowStartX - 70 * layout.scale, y: layout.rightY[i] - 0.13 * HEIGHT / effectiveDpr };
        const p2 = { x: rightArrowStartX, y: layout.rightY[i] };
        pt = bezierPt(obj.t, p0, p1, p2);
      } else if (obj.arrow === 'down') {
        const downStart = { x: fort.x + CONTEXTFORT_BOX_WIDTH * WIDTH / effectiveDpr * 0.5, y: fort.y + CONTEXTFORT_BOX_HEIGHT * HEIGHT / effectiveDpr };
        const downEnd = { x: downStart.x, y: downStart.y + 60 * layout.scale };
        pt = {
          x: downStart.x * (1 - obj.t) + downEnd.x * obj.t,
          y: downStart.y * (1 - obj.t) + downEnd.y * obj.t,
        };
      }
      if (pt) drawFlowObjectRect(ctx, obj, pt.x - w / 2, pt.y - h / 2, w, h, iconImg, layout);
    });

    // === Draw agent and fort boxes last so they are always on top ===
    // Use website-matching color for the boxes (e.g. #f8fafc for bg, #0f172a for text)
    const AGENT_BOX_COLOR = "#f8fafc"; // light background
    const AGENT_TEXT_COLOR = "#334155"; // slate-700 text
    const agentBoxW = CONTEXTFORT_BOX_WIDTH * WIDTH / effectiveDpr * (layout.isMobile ? 0.85 : 1);
    const agentBoxH = CONTEXTFORT_BOX_HEIGHT * HEIGHT / effectiveDpr * (layout.isMobile ? 0.85 : 1);
    // Draw Agent box
    drawSolidBox(
      ctx,
      agent.x,
      agent.y - 0.055 * HEIGHT / effectiveDpr,
      agentBoxW,
      agentBoxH,
      "Agent",
      AGENT_BOX_COLOR,
      AGENT_TEXT_COLOR,
      layout
    );
    // Draw Fort box (ContextFort)
    drawSolidBox(
      ctx,
      fort.x,
      fort.y - 0.055 * HEIGHT / effectiveDpr,
      CONTEXTFORT_BOX_WIDTH * WIDTH / effectiveDpr * (layout.isMobile ? 0.85 : 1),
      CONTEXTFORT_BOX_HEIGHT * HEIGHT / effectiveDpr * (layout.isMobile ? 0.85 : 1),
      "ContextFort",
      AGENT_BOX_COLOR,
      AGENT_TEXT_COLOR,
      layout
    );
    // Draw 'Scan Tool Calls' (top left inside ContextFort box)
    ctx.save();
    ctx.font = `bold ${Math.max(layout.isMobile ? 9 : 10, Math.round((layout.isMobile ? 10 : 12) * layout.scale))}px Inter, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = AGENT_TEXT_COLOR;
    ctx.globalAlpha = 0.85;
    ctx.fillText("Scan Tool Calls", fort.x + 10 * layout.scale, fort.y - 0.055 * HEIGHT / effectiveDpr + 8 * layout.scale);
    ctx.restore();
    // Draw 'Block Data Exfil' (bottom right inside ContextFort box)
    ctx.save();
    ctx.font = `bold ${Math.max(layout.isMobile ? 9 : 10, Math.round((layout.isMobile ? 10 : 12) * layout.scale))}px Inter, sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = AGENT_TEXT_COLOR;
    ctx.globalAlpha = 0.85;
    ctx.fillText("Block Data Exfil", fort.x + CONTEXTFORT_BOX_WIDTH * WIDTH / dpr * (layout.isMobile ? 0.85 : 1) - 10 * layout.scale, fort.y - 0.055 * HEIGHT / effectiveDpr + CONTEXTFORT_BOX_HEIGHT * HEIGHT / dpr * (layout.isMobile ? 0.85 : 1) - 8 * layout.scale);
    ctx.restore();
    // Draw 'Retrieve Context' (top left inside Agent box)
    ctx.save();
    ctx.font = `bold ${Math.max(layout.isMobile ? 9 : 10, Math.round((layout.isMobile ? 10 : 12) * layout.scale))}px Inter, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = AGENT_TEXT_COLOR;
    ctx.globalAlpha = 0.85;
    ctx.fillText("Retrieve Context", agent.x + 10 * layout.scale, agent.y - 0.055 * HEIGHT / effectiveDpr + 8 * layout.scale);
    ctx.restore();
    // Draw 'Perform Actions' (bottom right inside Agent box)
    ctx.save();
    ctx.font = `bold ${Math.max(layout.isMobile ? 9 : 10, Math.round((layout.isMobile ? 10 : 12) * layout.scale))}px Inter, sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = AGENT_TEXT_COLOR;
    ctx.globalAlpha = 0.85;
    ctx.fillText("Perform Actions", agent.x + agentBoxW - 10 * layout.scale, agent.y - 0.055 * HEIGHT / effectiveDpr + agentBoxH - 8 * layout.scale);
    ctx.restore();
    // Draw VSCode, windsurf, and Cursor logos below Agent box (horizontal)
    const logoY = agent.y - 0.055 * HEIGHT / effectiveDpr + agentBoxH + 18 * layout.scale;
    const logoSize = 28 * layout.scale;
    const logoGap = 18 * layout.scale;
    const logoStartX = agent.x + agentBoxW / 2 - 1.5 * logoSize - logoGap;
    // Draw all logos in a row
    logoConfigs.forEach((cfg, i) => {
      drawLogoOrFallback(
        ctx,
        imageCache.current[cfg.imgKey],
        cfg.color,
        logoStartX + i * (logoSize + logoGap),
        logoY,
        logoSize
      );
    });
  };

  // Start animation when in viewport
  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;
    
    if (isInViewport) {
      startAnimation(canvas, renderCanvas);
    } else {
      stopAnimation();
    }
    
    return () => {
      stopAnimation();
    };
  }, [isInViewport, startAnimation, stopAnimation, renderCanvas, canvasRef]);

  return (
    <div
      ref={wrapperRef}
      className={`w-full max-w-full aspect-[4/3] sm:aspect-[900/320] optimize-when-scrolling ${scrollClass}`}
      style={{
        minHeight: 140,
        maxHeight: 320,
        width: '100%',
        position: 'relative',
        touchAction: 'manipulation',
        overflow: 'hidden',
      }}
    >
      <canvas 
        ref={canvasRef} 
        className="rounded-xl shadow-md w-full h-full layout-contain" 
        style={{ 
          background: 'transparent', 
          width: '100%', 
          height: '100%', 
          display: 'block', 
          touchAction: 'manipulation',
          opacity: isScrolling ? 0.9 : 1, // Slight opacity change during scroll
          transition: isScrolling ? 'none' : 'opacity 0.2s ease-out',
        }} 
      />
    </div>
  );
};

// Export a memoized version of the component for better performance
export default React.memo(FlowDiagram);
