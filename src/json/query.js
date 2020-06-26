import {
  TYPE_STRING,
  TYPE_NUMBER
} from "../native/constants";

import { compile } from "./compile";

const COMPILED = [];
let COMPILED_LENGTH = 0;
let COMPILED_INDEX = {};
let MAX_COMPILED = 100;

/**
 * Updates the maximum number of compiled JSON Queries to cache before they are purged.
 *
 * @param {number} max - The maximum number of compiled to cache.
 * @returns {boolean} Returns true if maximum number is updated, or false otherwise.
 */
export function updateMaxCompiled(max) {
  if (typeof max === TYPE_NUMBER && max > 0) {
    MAX_COMPILED = max;
    return true;
  }

  return false;
}

/**
 * Runs a JSON Query [querycode] on [subject] and returns query result.
 *
 * @param {string} querycode - JSON Query code.
 * @param {*} subject - The data to process with JSON Query.
 * @returns {*} JSON Query Result.
 */
export function query(querycode, subject) {
  const max = MAX_COMPILED;
  const compiledList = COMPILED;
  let indexed = COMPILED_INDEX;
  let length = COMPILED_LENGTH;

  if (typeof querycode !== TYPE_STRING) {
    return undefined;
  }

  if (querycode in indexed) {
    return compiledList[indexed[querycode]](subject);
  }

  // clear
  if (length + 1 > max) {
    COMPILED_LENGTH = length = compiledList.length = 0;
    COMPILED_INDEX = indexed = {};
  }

  indexed[querycode] = length = COMPILED_LENGTH++;

  return (compiledList[length] = compile(querycode))(subject);
}
