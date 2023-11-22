import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "index",
      fileName: (format) => `index.${format}.js`,
    },
  },
  plugins: [svelte()],
});
