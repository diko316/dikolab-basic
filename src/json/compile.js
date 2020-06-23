import {
  EMPTY_FUNCTION,
  TYPE_STRING
} from "../native/constants";

import { FUNCTION } from "../native/function";

import HELPER from "./helper";

import { build } from "./build";

export function compile(subject) {
  const emptyFunction = EMPTY_FUNCTION;
  let result = null;

  function exec(data) {
    return result(data, HELPER);
  }

  if (typeof subject !== TYPE_STRING) {
    return emptyFunction;
  }

  result = build(subject);
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
