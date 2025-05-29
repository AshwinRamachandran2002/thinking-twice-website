import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // In production with custom domain, use root path; otherwise use repo name for GitHub Pages
<<<<<<< HEAD
  const base = process.env.CUSTOM_DOMAIN === 'true' ? '/' : '/';
=======
  const base = process.env.CUSTOM_DOMAIN === 'true' ? '/' : '/thinking-twice-website/';
>>>>>>> recover-branch
  
  return {
    base,
    server: {
      host: "::",
      port: 8080,
<<<<<<< HEAD
=======
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
>>>>>>> recover-branch
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  }
});
