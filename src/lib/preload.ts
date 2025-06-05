// Create a global cache for preloaded images
const preloadedImageCache: Record<string, HTMLImageElement> = {};

// Preload important images to improve rendering performance
export const preloadImages = () => {
  const highPriorityImages = [
    // Commonly used icons
    '/assets/slack.svg',
    '/assets/github.svg', 
    '/assets/calendar.svg',
    '/assets/hubspot.svg',
    '/assets/drive.svg',
    '/assets/sheets.svg',
  ];
  
  // Secondary assets to load after the critical ones
  const secondaryImages = [
    '/assets/vscode.svg',
    '/assets/notion.svg',
    '/assets/jira.svg',
    '/assets/salesforce.svg',
    '/assets/devil.svg',
    '/assets/workday.svg',
  ];
  
  // Preload high priority images immediately
  highPriorityImages.forEach(src => preloadImage(src, true));
  
  // Preload secondary images after a short delay
  setTimeout(() => {
    secondaryImages.forEach(src => preloadImage(src, false));
  }, 1000);
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
