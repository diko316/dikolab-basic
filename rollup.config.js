import settings from "./package.json";
import applyPlugin from "./rollup/apply-plugin";

const ENTRY_FILE = "src/index.js";
const MODULE_NAME = settings.name.replace(/@[^/]+\//, "");

const JSON_OPTIONS = {
  name: "json",
  options: {
    compact: true,
    preferConst: true
  }
};

const CLEANUP_OPTIONS = {
  name: "cleanup",
  options: {
    comments: "none",
    sourcemap: true
  }
};

export default [
  applyPlugin(
    {
      input: ENTRY_FILE,
      output: {
        file: `umd/${MODULE_NAME}.js`,
        format: "umd",
        name: "diko$basic",
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
      JSON_OPTIONS,
      "strip",
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
        preserveModules: true,
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
      JSON_OPTIONS,
      "strip",
      "buble",
      CLEANUP_OPTIONS
    ]
  ),
  applyPlugin(
    {
      input: ENTRY_FILE,
      output: {
        dir: `cjs`,
        format: "cjs",
        exports: "named",
        preserveModules: true,
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
      JSON_OPTIONS,
      "strip",
      "buble",
      CLEANUP_OPTIONS
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
      JSON_OPTIONS,
      "strip",
      "buble",
      CLEANUP_OPTIONS
    ]
  )
];
