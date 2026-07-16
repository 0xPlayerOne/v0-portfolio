import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

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
        branches: 25,
        functions: 25,
        lines: 25,
        statements: 25,
      },
    },
  },
})
