import applyPlugin from "./rollup/apply-plugin";

const OUTPUT_DIR = "dist";

export default [
  applyPlugin(
    {
      input: "src/**/*.test.js",
      output: {
        file: `${OUTPUT_DIR}/test/mocha-feed.js`,
        format: "cjs",
        sourcemap: true,
        globals: {
          chai: "chai",
          it: "it",
          describe: "describe"
        }
      }
    },
    [
      "multi-entry",
      "eslint",
      {
        name: "delete",
        options: {
          targets: "dist/cjs/*"
        }
      },
      "node-resolve",
      "commonjs",
      "buble"
    ]
  )
];
