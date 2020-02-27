import babel from 'rollup-plugin-babel';

export default function apply(options) {
  let newOptions = options;

  if (!options) {
    newOptions = {};
  }

  if (!newOptions.exclude) {
    newOptions.exclude = 'node_modules/**'; // only transpile our source code
  }

  return babel(newOptions);
}
