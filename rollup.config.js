import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
  input: "./src/index.ts",
  output: {
    format: "umd",
    name: "Bulmaselect",
    dir: "./dist/",
  },

  plugins: [
    typescript(),
    terser({
      format: {
        source_map: false,
      },
      mangle: true,
      compress: true,
      ecma: true,
    }),
  ],
};
