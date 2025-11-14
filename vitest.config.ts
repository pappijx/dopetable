import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./tests/setup-test-environment.ts"],
    include: [
      "./components/**/*.{spec,test}.{ts,tsx}",
      "./stores/**/*.{spec,test}.{ts,tsx}",
      "./app/**/*.{spec,test}.{ts,tsx}",
      "./tests/**/*.{spec,test}.{ts,tsx}",
    ],
    exclude: ["node_modules", "build", ".next", "dist"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
