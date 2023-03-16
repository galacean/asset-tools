import { defineConfig } from "vite";
import path from "path";

const rootDir = path.join(process.cwd(), "src");

export default defineConfig({
  resolve: {
    // alias: [{ find: "@oasis-engine/asset-tools", replacement: rootDir }]
  }
});
