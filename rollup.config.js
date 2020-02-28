import settings from "./package.json";
import applyPlugin from "./rollup/apply-plugin";

const OUTPUT_DIR = "dist";
const ENTRY_FILE = "src/index.js";
const MODULE_NAME = settings.name.replace(/@[^/]+\//, "");

export default [
  applyPlugin(
    {
      input: ENTRY_FILE,
      output: {
        file: `${OUTPUT_DIR}/umd/${MODULE_NAME}.js`,
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
          targets: "dist/umd/*"
        }
      },
      "node-resolve",
      "commonjs",
      "buble",
      "terser"
    ]
  ),
  applyPlugin(
    {
      input: ENTRY_FILE,
      output: {
        dir: `${OUTPUT_DIR}/esm`,
        format: "esm",
        sourcemap: true
      }
    },
    [
      "eslint",
      {
        name: "delete",
        options: {
          targets: "dist/esm/*"
        }
      },
      "node-resolve",
      "commonjs",
      "buble"
    ]
  ),
  applyPlugin(
    {
      input: ENTRY_FILE,
      output: {
        dir: `${OUTPUT_DIR}/cjs`,
        format: "cjs",
        sourcemap: true
      }
    },
    [
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
  ),
  applyPlugin(
    {
      input: ENTRY_FILE,
      output: {
        dir: `${OUTPUT_DIR}/system`,
        format: "system",
        sourcemap: true
      }
    },
    [
      "eslint",
      {
        name: "delete",
        options: {
          targets: "dist/system/*"
        }
      },
      "node-resolve",
      "commonjs",
      "buble"
    ]
  )
];
