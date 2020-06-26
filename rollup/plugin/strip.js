import strip from "@rollup/plugin-strip";

export default function apply(options) {
  return options ? strip(options) : strip();
}
