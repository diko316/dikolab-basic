import settings from './package.json';
import applyPlugin from './rollup/apply-plugin';

const OUTPUT_DIR = 'dist';
const ENTRY_FILE = 'src/index.js';
const MODULE_NAME = settings.name.replace(/\@[^\/]+\//, '');

export default [
  applyPlugin(
    {
      input: ENTRY_FILE,
      output: {
        file: `${OUTPUT_DIR}/umd/${MODULE_NAME}.js`,
        format: "umd",
        name: "basic",
        esModule: false
      }
    },
    [
      'node-resolve',
      'commonjs',
      'babel',
      'terser'
    ]
  ),
  applyPlugin(
    {
      input: ENTRY_FILE,
      output: {
        dir: `${OUTPUT_DIR}/esm`,
        format: "esm"
      }
    },
    [
      'node-resolve',
      'commonjs',
      'babel'
    ]
  ),
  applyPlugin(
    {
      input: ENTRY_FILE,
      output: {
        dir: `${OUTPUT_DIR}/cjs`,
        format: "cjs"
      }
    },
    [
      'node-resolve',
      'commonjs',
      'babel'
    ]
  ),
  applyPlugin({
      input: ENTRY_FILE,
      output: {
        dir: `${OUTPUT_DIR}/system`,
        format: "system"
      }
    },
    [
      'node-resolve',
      'commonjs',
      'babel'
    ]
  )
];
