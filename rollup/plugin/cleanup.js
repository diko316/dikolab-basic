import cleanup from "rollup-plugin-cleanup";

export default function apply(options) {
  return options ? cleanup(options) : cleanup();
}
