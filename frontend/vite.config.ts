import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
/// <reference types="vitest" />

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
    watch: {
      ignored: ["**/gsheets-auth/**", "**/backend/**", "**/nginx/**", "**/venv/**"],
    },
  },
  optimizeDeps: {
    exclude: [],
    // Prevent Vite from crawling large non-JS directories at the repo root
    entries: ["index.html"],
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
});
