import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  oxc: {
    jsx: {
      runtime: "automatic",
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 15_000,
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: [
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "constants/**/*.ts",
        "hooks/**/*.ts",
        "lib/**/*.{ts,tsx}",
        "views/**/*.tsx",
      ],
      exclude: ["components/ui/**", "**/*.d.ts", "**/types.ts"],
      thresholds: {
        branches: 72,
        functions: 85,
        lines: 83,
        statements: 84,
      },
    },
  },
});
