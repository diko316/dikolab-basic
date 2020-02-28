import cleanupDirectory from "rollup-plugin-delete";

export default function apply(options) {
  return options ? cleanupDirectory(options) : cleanupDirectory();
}
