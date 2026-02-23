import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/set": "https://node-cache-engine.onrender.com",
      "/get": "https://node-cache-engine.onrender.com",
      "/delete": "https://node-cache-engine.onrender.com",
      "/metrics": "https://node-cache-engine.onrender.com",
      "/namespace": "https://node-cache-engine.onrender.com",
      "/subscribe": {
        target: "https://node-cache-engine.onrender.com",
        changeOrigin: true,
      },
      "/publish": "https://node-cache-engine.onrender.com",
      "/keys": "https://node-cache-engine.onrender.com",
    },
  },
});
