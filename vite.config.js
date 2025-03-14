import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "./src/transformer.js"),
      fileName: (format) => `transformer.${format}.js`,
      name: "@macroing/transformer.js"
    }
  }
});