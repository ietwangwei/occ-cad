import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import wasm from "vite-plugin-wasm";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wasm(),
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, "./src/assets/icons")],
      symbolId: "icon-[dir]-[name]",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["opencascade.js/dist/openscade.full.wasm"],
  },
});
