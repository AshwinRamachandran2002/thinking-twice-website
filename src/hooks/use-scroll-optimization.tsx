import { useEffect, useState, useRef, useCallback } from 'react';

interface ScrollOptimizationOptions {
  delay?: number;        // Delay in ms before resetting the scroll state
  debounce?: number;     // Debounce time for scroll events
  includeTouch?: boolean; // Whether to include touch events
}

/**
 * Enhanced scroll optimization hook with more options and performance tracking
 */
export const useScrollOptimization = (options: ScrollOptimizationOptions = {}) => {
  const { 
    delay = 150,           // Default delay is 150ms
    debounce = 20,         // Default debounce is 20ms
    includeTouch = true,   // Include touch events by default
  } = options;
  
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHeavyScrolling, setIsHeavyScrolling] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const debounceId = useRef<NodeJS.Timeout | null>(null);
  const scrollCount = useRef(0);
  const scrollStartTime = useRef(0);

  // Performance tracking
  const [scrollFPS, setScrollFPS] = useState(60);
  const scrollFrames = useRef(0);

  const resetScroll = useCallback(() => {
    setIsScrolling(false);
    setIsHeavyScrolling(false);
    
    // Calculate scroll performance metrics
    const duration = performance.now() - scrollStartTime.current;
    if (duration > 100) { // Only calculate if scrolled for at least 100ms
      const fps = Math.round((scrollFrames.current * 1000) / duration);
      setScrollFPS(fps);
    }
    
    // Reset counters
    scrollCount.current = 0;
    scrollFrames.current = 0;
  }, []);

  const handleScroll = useCallback(() => {
    // Don't repeatedly set state during continuous scrolling, just mark the initial state
    if (!isScrolling) {
      setIsScrolling(true);
      scrollStartTime.current = performance.now();
    }
    
    // Track scroll count to detect heavy scrolling
    scrollCount.current += 1;
    scrollFrames.current += 1;
    
    // After a certain threshold, mark as heavy scrolling for more aggressive optimizations
    if (scrollCount.current > 5) {
      setIsHeavyScrolling(true);
    }
    
    // Clear any existing timeouts
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    
    // Set a new timeout to mark scrolling as finished after the specified delay
    timeoutId.current = setTimeout(resetScroll, delay);
    
    // Debounce the scroll handler itself
    if (debounceId.current) {
      return;
    }
    
    debounceId.current = setTimeout(() => {
      debounceId.current = null;
    }, debounce);
  }, [isScrolling, delay, debounce, resetScroll]);

  useEffect(() => {
    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Optionally handle touch events for mobile
    if (includeTouch) {
      window.addEventListener('touchmove', handleScroll, { passive: true });
    }
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (includeTouch) {
        window.removeEventListener('touchmove', handleScroll);
      }
      
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      
      if (debounceId.current) {
        clearTimeout(debounceId.current);
      }
    };
  }, [handleScroll, includeTouch]);
  
  // Add a "just stopped" class for 300ms after scrolling
  const [hasJustStopped, setHasJustStopped] = useState(false);
  
  useEffect(() => {
    if (!isScrolling && scrollCount.current > 0) {
      setHasJustStopped(true);
      const resetTimeout = setTimeout(() => {
        setHasJustStopped(false);
      }, 300);
      
      return () => clearTimeout(resetTimeout);
    }
  }, [isScrolling]);
  
  // Return scroll state and CSS classes to apply
  return {
    isScrolling,
    isHeavyScrolling,
    hasJustStopped,
    scrollFPS,
    scrollClass: 'heavy-optimize-scrolling' // Always use heavy optimization class to prevent animations
  };
};
