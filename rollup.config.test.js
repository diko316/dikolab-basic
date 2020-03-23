import applyPlugin from "./rollup/apply-plugin";

export default [
  applyPlugin(
    {
      external: [
        "chai",
        "unexpected"
      ],
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
      "json",
      "buble"
    ]
  )
];
