import commonjs from "@rollup/plugin-commonjs";

export default function apply(options) {
  let newOptions = options;

  if (!options) {
    newOptions = {};
  }

  if (!newOptions.exclude) {
    newOptions.include = /node_modules/; // only transpile our source code
  }

  return commonjs(newOptions);
}
