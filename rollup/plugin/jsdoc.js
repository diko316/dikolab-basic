import jsdoc from "rollup-plugin-jsdoc";

export default function apply(options) {
  const defaultOptions = {
  };
  return jsdoc(options || defaultOptions);
}
