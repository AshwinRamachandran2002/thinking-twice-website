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
        // Update state when observer callback fires
        setIsInViewport(entry.isIntersecting);
      },
      {
        // Default options that can be overridden
        rootMargin: '0px',
        threshold: 0.1,
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
