import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000
  },
  plugins: [react()],
  resolve: {
    alias: [
      { find: "src/", replacement: `${path.resolve(__dirname, "src")}/` },
      { find: /^@mui\/icons-material\/(.+)/, replacement: "@mui/icons-material/esm/$1" }
    ]
  }
});
