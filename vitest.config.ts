import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    env: {
      NODE_ENV: "test",
    },
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/test/**",
        "src/frontend/views/index.ts",
        "src/frontend/layouts/index.ts",
        "src/frontend/components/index.ts",
      ],
      provider: "v8",
      reporter: ["lcov", "text"],
    },
  },
});
