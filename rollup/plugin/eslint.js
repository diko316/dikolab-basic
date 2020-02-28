import { eslint } from "rollup-plugin-eslint";

export default function apply(options) {
  return options ? eslint(options) : eslint();
}
