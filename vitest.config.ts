import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    include: [
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
      "tests/integration/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["node_modules", ".next", "tests/e2e/**"],
    globals: true,
    environment: "node",
    pool: "threads",
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
