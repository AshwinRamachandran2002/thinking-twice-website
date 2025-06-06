// Create a global cache for preloaded images
const preloadedImageCache: Record<string, HTMLImageElement> = {};

// Preload important images to improve rendering performance
export const preloadImages = () => {
  // No images to preload currently
  return;
};

// Helper to preload a single image with optional high priority
const preloadImage = (src: string, highPriority = false) => {
  if (preloadedImageCache[src]) return preloadedImageCache[src];
  
  const img = new Image();
  
  if (highPriority) {
    img.fetchPriority = 'high';
  }
  
  img.src = src;
  preloadedImageCache[src] = img;
  return img;
};

// Export the cache so components can use the preloaded images
export const getPreloadedImage = (src: string): HTMLImageElement | null => {
  return preloadedImageCache[src] || null;
};
