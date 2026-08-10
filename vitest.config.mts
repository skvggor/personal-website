import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      include: ["lib/particles/**/*.ts", "components/particles/**/*.{ts,tsx}"],
      exclude: ["**/*.test.*", "**/*.d.ts"],
      thresholds: { lines: 80, functions: 80, statements: 80, branches: 80 },
    },
  },
});
