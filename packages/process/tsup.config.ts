import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: { index: "src/index.ts", edit: "src/edit.ts" },
  format: ["esm"],
  dts: !options.watch,
  splitting: true,
  sourcemap: true,
  clean: !options.watch,
  treeshake: true,
  external: [/^@/, /^react/, /^lucide-react/],
}));
