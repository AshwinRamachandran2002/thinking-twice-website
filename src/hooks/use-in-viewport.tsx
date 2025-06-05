import { useEffect, useState, useRef } from 'react';

// A hook that tracks if an element is in the viewport
export const useInViewport = (options = {}) => {
  const [isInViewport, setIsInViewport] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state with a small delay to smooth out quick transitions
        if (entry.isIntersecting) {
          // Only set to true if actually intersecting
          requestAnimationFrame(() => {
            setIsInViewport(true);
          });
        } else if (!entry.isIntersecting && entry.intersectionRatio === 0) {
          // Only set to false if fully out of view
          setIsInViewport(false);
        }
      },
      {
        // Default options that can be overridden
        rootMargin: '0px',
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0], // Multiple thresholds for smoother transitions
        ...options,
      }
    );

    // Start observing the target element
    observer.observe(element);

    // Clean up the observer when the component unmounts
    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [options]);

  return { elementRef, isInViewport };
};
