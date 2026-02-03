import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from "kimi-plugin-inspect-react"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const base = process.env.VITE_BASE ?? (mode === "production" ? "/portfolio/" : "/");
  const outDir = process.env.VITE_OUT_DIR ?? "docs";

  return {
    base,
    plugins: [inspectAttr(), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir,
      emptyOutDir: true,
    },
  };
});
