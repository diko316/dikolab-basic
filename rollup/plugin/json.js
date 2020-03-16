import json from "@rollup/plugin-json";

export default function apply(options) {
  return options ? json(options) : json();
}
