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
        file: "dist/test/mocha-feed.js",
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
          targets: "dist/test/*"
        }
      },
      "node-resolve",
      "commonjs",
      "json",
      "buble"
    ]
  )
];
