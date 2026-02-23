import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/set": "http://localhost:3000",
      "/get": "http://localhost:3000",
      "/delete": "http://localhost:3000",
      "/metrics": "http://localhost:3000",
      "/namespace": "http://localhost:3000",
      "/subscribe": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/publish": "http://localhost:3000",
      "/keys": "http://localhost:3000",
    },
  },
});
