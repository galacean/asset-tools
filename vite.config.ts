import { defineConfig } from "vite";
import path from "path";

const rootDir = path.join(process.cwd(), "src");

export default defineConfig({
  resolve: {
    alias: [{ find: "@galacean/asset-tools", replacement: rootDir }]
  },
  root: 'example',
});
