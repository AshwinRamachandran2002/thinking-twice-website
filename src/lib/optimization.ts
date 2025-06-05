/**
 * Optimization utilities for improving website performance
 */

// Cache for any expensive operations
const memoCache = new Map<string, any>();

/**
 * Memoize expensive calculations with a simple cache
 * @param key Unique identifier for the calculation
 * @param calculate Function that performs the expensive calculation
 * @param maxAgeMs Maximum age of the cached value in milliseconds (optional)
 * @returns The calculated or cached value
 */
export function memoize<T>(key: string, calculate: () => T, maxAgeMs?: number): T {
  // Check if we have a cached value
  if (memoCache.has(key)) {
    const { value, timestamp } = memoCache.get(key);
    
    // If no max age or the value is still fresh, return it
    if (!maxAgeMs || Date.now() - timestamp < maxAgeMs) {
      return value;
    }
  }
  
  // Calculate the value and cache it
  const value = calculate();
  memoCache.set(key, { value, timestamp: Date.now() });
  return value;
}

/**
 * Clear a specific item from the memo cache
 * @param key The key to clear
 */
export function clearMemoCache(key: string): void {
  memoCache.delete(key);
}

/**
 * Clear the entire memo cache
 */
export function clearAllMemoCache(): void {
  memoCache.clear();
}

/**
 * Throttle a function to prevent it from executing too frequently
 * @param func The function to throttle
 * @param limit The minimum time between executions in milliseconds
 * @returns The throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>): void {
    const now = Date.now();
    
    if (now - lastCall >= limit) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      
      lastCall = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastCall = Date.now();
        timeout = null;
        func(...args);
      }, limit - (now - lastCall));
    }
  };
}

/**
 * Debounce a function to prevent it from executing until after a delay
 * @param func The function to debounce
 * @param wait The delay in milliseconds
 * @param immediate If true, trigger the function on the leading edge instead of the trailing edge
 * @returns The debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      func(...args);
    }
  };
}

/**
 * Detect if the device is a mobile device
 * @returns True if the device is mobile, false otherwise
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Generate a unique ID for elements
 * @returns A unique string ID
 */
export function generateUniqueId(): string {
  return `id_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Schedule a task to run during browser idle time
 * @param task The task to run
 * @param timeout Maximum time to wait before running the task directly
 */
export function runWhenIdle(task: () => void, timeout = 2000): void {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(task, { timeout });
  } else {
    setTimeout(task, 1);
  }
}

/**
 * Create a simple, performant LRU (Least Recently Used) cache
 * @param maxSize Maximum number of items to store in the cache
 * @returns An object with set, get, and has methods
 */
export function createLRUCache<K, V>(maxSize = 100) {
  const cache = new Map<K, V>();
  
  return {
    get(key: K): V | undefined {
      const value = cache.get(key);
      if (value !== undefined) {
        // Move item to the end of the map (most recently used)
        cache.delete(key);
        cache.set(key, value);
      }
      return value;
    },
    
    set(key: K, value: V): void {
      // Remove oldest item if we're at capacity
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      
      // Add new item
      cache.set(key, value);
    },
    
    has(key: K): boolean {
      return cache.has(key);
    },
    
    clear(): void {
      cache.clear();
    },
    
    size(): number {
      return cache.size;
    }
  };
}

/**
 * Detect if the browser is in a low-power state
 * (e.g., battery saver mode or low battery)
 */
export async function isLowPowerMode(): Promise<boolean> {
  if ('getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery();
      return battery.level < 0.2 && !battery.charging;
    } catch (e) {
      console.warn('Battery status check failed', e);
    }
  }
  
  // Fallback to assuming normal power mode
  return false;
}
