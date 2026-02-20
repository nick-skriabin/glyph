import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: false,
  clean: true,
  external: ["react", "@semos-labs/glyph", "shiki"],
  treeshake: true,
  minify: true,
});
