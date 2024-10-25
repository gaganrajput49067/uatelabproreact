import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    mode: "development",
    plugins: [react()],

    server: {
      port:3001,
      proxy: {
        "/api": {
          target: process.env.VITE_PROXY_HOST,
          changeOrigin: true,
        },
        "/reports": {
          target: process.env.VITE_PROXY_HOST,
          changeOrigin: true,
        },
      },
      
    },
  });
};
