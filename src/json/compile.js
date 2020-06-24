import {
  EMPTY_FUNCTION,
  TYPE_STRING
} from "../native/constants";

import { FUNCTION } from "../native/function";

import HELPER from "./helper";

import { build } from "./build";

/**
 * @typedef {function} exec
 * @param {*} data - The data to run JSON Query.
 * @returns {*} The result of JSON Query.
 */

/**
 * Generates compiled JSON Query function for query re-use.
 *
 * @param {string} query - JSON Query string.
 * @returns {exec} JSON Query function
 */
export function compile(query) {
  const emptyFunction = EMPTY_FUNCTION;
  let result = null;

  function exec(data) {
    return result(data, HELPER);
  }

  if (typeof query !== TYPE_STRING) {
    return emptyFunction;
  }

  result = build(query);
  // console.log("param ", result[0]);
  // console.log("result ", result[1]);
  if (!result) {
    return emptyFunction;
  }

  try {
    result = new FUNCTION(result[0], result[1]);
    return exec;
  }
  catch (error) {
    return emptyFunction;
  }
}
