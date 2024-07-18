import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    // You can also add a proxy to the development server.
    // This is useful if you are using an API that is running on a different domain or port or both.
    // You can add a proxy to the development server so that you don't have to worry about CORS.
    proxy: {
      // https://vitejs.dev/config/server-options.html#server-proxy
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});