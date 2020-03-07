#!/bin/sh

npm install --dave-dev \
  @rollup/plugin-multi-entry \
  @rollup/plugin-buble \
  @rollup/plugin-commonjs \
  @rollup/plugin-node-resolve \
  browser-sync \
  chai \
  clear-cli \
  del-cli \
  eslint \
  eslint-config-standard \
  eslint-config-strict \
  eslint-plugin-import \
  eslint-plugin-jsdoc \
  eslint-plugin-node \
  eslint-plugin-promise \
  eslint-plugin-standard \
  ink-docstrap \
  jsdoc \
  mocha \
  nodemon \
  npm-run-all \
  rollup \
  rollup-plugin-delete \
  rollup-plugin-eslint \
  rollup-plugin-terser || exit $?


