import { useRef, useEffect, useState, useCallback } from 'react';
import { useScrollOptimization } from './use-scroll-optimization';
import { useInViewport } from './use-in-viewport';

interface UseCanvasOptimizationOptions {
  frameThreshold?: number;    // Milliseconds between frames (controls FPS)
  frameLimiter?: number;      // Only render every nth frame when scrolling
  rootMargin?: string;        // Intersection observer rootMargin
  threshold?: number;         // Intersection observer threshold
  dprLimit?: number;          // Maximum devicePixelRatio to use
  enableOffscreenRendering?: boolean; // Use OffscreenCanvas when available
}

/**
 * A specialized hook for optimizing canvas-based animations and visualizations
 * Combines scroll awareness, viewport visibility, and canvas-specific optimizations
 */
export const useCanvasOptimization = (options: UseCanvasOptimizationOptions = {}) => {
  const {
    frameThreshold = 100,     // Default to ~10FPS when scrolling (100ms between frames)
    frameLimiter = 3,         // Only render every 3rd frame when scrolling by default
    rootMargin = '200px',     // Default margin to detect when approaching viewport
    threshold = 0.1,          // Start rendering when 10% visible
    dprLimit = 1.5,           // Limit devicePixelRatio for better performance
    enableOffscreenRendering = true, // Use OffscreenCanvas when available
  } = options;

  // Track when component is in viewport
  const { elementRef, isInViewport } = useInViewport({
    threshold,
    rootMargin,
  });

  // Track scrolling state
  const { isScrolling, isHeavyScrolling, scrollClass } = useScrollOptimization();

  // Animation state tracking
  const raf = useRef<number | null>(null);
  const frameCounter = useRef(0);
  const lastFrameTime = useRef(0);
  const isInitialRender = useRef(true);
  const isRunningRef = useRef(false);
  const offscreenCanvas = useRef<OffscreenCanvas | null>(null);
  
  // Track canvas dimensions for efficient resizing
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const previousDimensions = useRef({ width: 0, height: 0 });
  
  // Helper to determine effective device pixel ratio based on scroll state
  const getEffectiveDpr = useCallback(() => {
    const dpr = window.devicePixelRatio || 1;
    const baseDprLimit = dprLimit;
    
    // Further reduce resolution during scrolling
    if (isHeavyScrolling) return Math.min(dpr, baseDprLimit * 0.5);
    if (isScrolling) return Math.min(dpr, baseDprLimit * 0.75);
    
    return Math.min(dpr, baseDprLimit);
  }, [isScrolling, isHeavyScrolling, dprLimit]);

  // Handle canvas resizing efficiently
  const handleResize = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas || !canvas.parentElement) return;
    
    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Only update if dimensions actually changed
    if (
      width !== previousDimensions.current.width || 
      height !== previousDimensions.current.height
    ) {
      const effectiveDpr = getEffectiveDpr();
      
      // Set canvas dimensions with pixel ratio
      canvas.width = width * effectiveDpr;
      canvas.height = height * effectiveDpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      // Update state and ref
      setDimensions({ width, height });
      previousDimensions.current = { width, height };
      
      // If using OffscreenCanvas, resize it too
      if (offscreenCanvas.current) {
        offscreenCanvas.current.width = width * effectiveDpr;
        offscreenCanvas.current.height = height * effectiveDpr;
      }
    }
  }, [getEffectiveDpr]);

  // Start animation loop
  const startAnimation = useCallback((
    canvas: HTMLCanvasElement,
    renderFrame: (ctx: CanvasRenderingContext2D, timestamp: number, dimensions: { width: number, height: number }) => void
  ) => {
    if (!canvas || isRunningRef.current) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Try to use OffscreenCanvas for better performance
    let offscreenCtx: CanvasRenderingContext2D | null = null;
    if (enableOffscreenRendering && 'OffscreenCanvas' in window) {
      try {
        offscreenCanvas.current = new OffscreenCanvas(canvas.width, canvas.height);
        offscreenCtx = offscreenCanvas.current.getContext('2d') as CanvasRenderingContext2D;
      } catch (e) {
        console.warn('OffscreenCanvas not supported or error:', e);
      }
    }
    
    isRunningRef.current = true;
    lastFrameTime.current = performance.now();
    frameCounter.current = 0;
    
    // Animation loop
    const loop = (timestamp: number) => {
      if (!isRunningRef.current) return;
      
      const now = timestamp;
      const deltaTime = now - lastFrameTime.current;
      const currentDimensions = { width: canvas.width, height: canvas.height };
      const effectiveDpr = getEffectiveDpr();
      
      // Skip rendering if not in viewport
      if (!isInViewport) {
        raf.current = requestAnimationFrame(loop);
        return;
      }
      
      // Skip rendering if not enough time has passed
      const currentFrameThreshold = isScrolling ? frameThreshold : 16; // 60fps when not scrolling
      if (deltaTime < currentFrameThreshold) {
        raf.current = requestAnimationFrame(loop);
        return;
      }
      
      // Frame skipping during scrolling
      if (isScrolling) {
        frameCounter.current += 1;
        const currentFrameLimiter = isHeavyScrolling ? frameLimiter * 2 : frameLimiter;
        if (frameCounter.current % currentFrameLimiter !== 0) {
          raf.current = requestAnimationFrame(loop);
          return;
        }
      }
      
      // Update timestamp for next frame
      lastFrameTime.current = now;
      
      // Render to offscreen canvas if available, then copy to main canvas
      if (offscreenCtx && offscreenCanvas.current) {
        // Set transform for DPR
        offscreenCtx.setTransform(effectiveDpr, 0, 0, effectiveDpr, 0, 0);
        
        // Clear and render to offscreen canvas
        offscreenCtx.clearRect(0, 0, offscreenCanvas.current.width, offscreenCanvas.current.height);
        renderFrame(offscreenCtx, now, currentDimensions);
        
        // Copy offscreen to main canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offscreenCanvas.current, 0, 0);
      } else {
        // Direct rendering to main canvas
        ctx.setTransform(effectiveDpr, 0, 0, effectiveDpr, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderFrame(ctx, now, currentDimensions);
      }
      
      // Continue loop
      raf.current = requestAnimationFrame(loop);
    };
    
    raf.current = requestAnimationFrame(loop);
  }, [isInViewport, isScrolling, isHeavyScrolling, frameThreshold, frameLimiter, getEffectiveDpr, enableOffscreenRendering]);

  // Stop animation loop
  const stopAnimation = useCallback(() => {
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
    isRunningRef.current = false;
  }, []);

  // Setup throttled resize handler
  useEffect(() => {
    const canvasElement = elementRef.current as HTMLCanvasElement | null;
    if (!canvasElement) return;
    
    // Initial resize
    handleResize(canvasElement);
    
    // Throttled resize handler
    let resizeTimeout: NodeJS.Timeout | null = null;
    const throttledResize = () => {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          resizeTimeout = null;
          handleResize(canvasElement);
        }, 150);
      }
    };
    
    window.addEventListener('resize', throttledResize);
    
    // Add ResizeObserver for robust resizing
    let observer: ResizeObserver | null = null;
    const observedElem = canvasElement.parentElement;
    if (window.ResizeObserver && observedElem) {
      observer = new ResizeObserver(throttledResize);
      observer.observe(observedElem);
    }
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (observer && observedElem) observer.unobserve(observedElem);
    };
  }, [handleResize]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
    };
  }, []);

  return {
    elementRef,
    isInViewport,
    isScrolling,
    isHeavyScrolling,
    scrollClass,
    dimensions,
    startAnimation,
    stopAnimation,
    handleResize,
    getEffectiveDpr,
  };
};
