import { terser } from "rollup-plugin-terser";

export default function apply(options) {
  return options ? terser(options) : terser();
}
