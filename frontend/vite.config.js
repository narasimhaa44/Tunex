import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  console.log("🔥 VITE MODE:", mode);
  console.log("🔥 API URL:", env.VITE_API_BASE_URL);

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
        "/uploads": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
        env.VITE_API_BASE_URL || ""
      ),
    },
  };
});
