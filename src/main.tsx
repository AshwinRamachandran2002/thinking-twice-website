import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/performance.css'
import { preloadImages } from './lib/preload'

// Preload critical images for better performance
preloadImages();

createRoot(document.getElementById("root")!).render(<App />);
