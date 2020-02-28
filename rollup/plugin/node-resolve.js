import resolve from "@rollup/plugin-node-resolve";

export default function apply(options) {
  return options ? resolve(options) : resolve();
}
