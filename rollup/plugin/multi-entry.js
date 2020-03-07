import multiEntry from "@rollup/plugin-multi-entry";

export default function apply(options) {
  return options ? multiEntry(options) : multiEntry();
}
