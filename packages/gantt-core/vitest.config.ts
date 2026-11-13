import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/__tests__/**/*.test.ts"],
    environment: "node",
    // Fetches the Microsoft Project sample files on the first run; later runs find them in place.
    globalSetup: ["./scripts/oracle-setup.mjs"],
  },
});
