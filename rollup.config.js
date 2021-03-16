import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
  input: "./src/index.ts",
  output: {
    format: "umd",
    name: "Bulmaselect",
    dir: "./dist/",
    sourcemap: true,
  },

  plugins: [
    typescript(),
    terser({
      mangle: true,
      compress: true,
      ecma: true,
    }),
  ],
};
