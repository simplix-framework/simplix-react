import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: { index: "src/index.ts", mspdi: "src/mspdi/index.ts" },
  format: ["esm"],
  dts: !options.watch,
  splitting: true,
  treeshake: true,
  clean: !options.watch,
}));
