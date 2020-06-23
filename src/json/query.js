import {
  TYPE_STRING,
  TYPE_NUMBER
} from "../native/constants";

import { compile } from "./compile";

const COMPILED = [];
let COMPILED_LENGTH = 0;
let COMPILED_INDEX = {};
let MAX_COMPILED = 100;

export function updateMaxCompiled(max) {
  if (typeof max === TYPE_NUMBER && max > 0) {
    MAX_COMPILED = max;
    return true;
  }

  return false;
}

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
