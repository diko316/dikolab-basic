import settings from "./package.json";
import applyPlugin from "./rollup/apply-plugin";

const ENTRY_FILE = "src/index.js";
const MODULE_NAME = settings.name.replace(/@[^/]+\//, "");

export default [
  applyPlugin(
    {
      input: ENTRY_FILE,
      output: {
        file: `umd/${MODULE_NAME}.js`,
        format: "umd",
        name: "basic",
        esModule: false,
        sourcemap: true
      }
    },
    [
      "eslint",
      {
        name: "delete",
        options: {
          targets: "umd/*"
        }
      },
      "node-resolve",
      "commonjs",
      "json",
      "buble",
      "terser"
    ]
  ),
  applyPlugin(
    {
      input: ENTRY_FILE,
      output: {
        dir: `esm`,
        format: "esm",
        sourcemap: true
      }
    },
    [
      "eslint",
      {
        name: "delete",
        options: {
          targets: "esm/*"
        }
      },
      "node-resolve",
      "commonjs",
      "json",
      "buble"
    ]
  ),
  applyPlugin(
    {
      input: ENTRY_FILE,
      output: {
        dir: `cjs`,
        format: "cjs",
        sourcemap: true
      }
    },
    [
      "eslint",
      {
        name: "delete",
        options: {
          targets: "cjs/*"
        }
      },
      "node-resolve",
      "commonjs",
      "json",
      "buble"
    ]
  ),
  applyPlugin(
    {
      input: ENTRY_FILE,
      output: {
        dir: `system`,
        format: "system",
        sourcemap: true
      }
    },
    [
      "eslint",
      {
        name: "delete",
        options: {
          targets: "system/*"
        }
      },
      "node-resolve",
      "commonjs",
      "json",
      "buble"
    ]
  )
];
