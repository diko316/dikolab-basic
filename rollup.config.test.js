import applyPlugin from "./rollup/apply-plugin";

export default [
  applyPlugin(
    {
      input: "src/**/*.test.js",
      output: {
        file: "test/mocha-feed.js",
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
          targets: "test/*"
        }
      },
      "node-resolve",
      "commonjs",
      "buble"
    ]
  )
];
