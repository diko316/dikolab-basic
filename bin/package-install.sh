#!/bin/sh

npm install --dave-dev \
  @rollup/plugin-buble \
  @rollup/plugin-commonjs \
  @rollup/plugin-json \
  @rollup/plugin-multi-entry \
  @rollup/plugin-node-resolve \
  better-docs \
  browser-sync \
  chai \
  clear-cli \
  del-cli \
  documentation \
  esdoc \
  esdoc-standard-plugin \
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
  jsdoc-babel \
  mocha \
  nodemon \
  npm-run-all \
  rollup \
  rollup-plugin-delete \
  rollup-plugin-eslint \
  rollup-plugin-terser \
  unexpected || exit $?


