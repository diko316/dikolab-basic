import {
  TYPE_STRING,
  TYPE_NUMBER,
  TYPE_BIGINT,
  EMPTY_STRING
} from "../native/constants";

import { IS_FINITE } from "../native/number";

import {
  STRING,
  STRING_FROM_CHARCODE
} from "../native/string";

import { words as WORD_INDEX } from "./utf-constants.json";

/**
 * Converts snake case string to camel case.
 * Take note that this will also UTF-8 safe.
 *
 * @param {string} subject Snake-case string to convert.
 * @returns {string} camel-cased string.
 */
export function camelize(subject) {
  const string = STRING;
  const empty = EMPTY_STRING;
  const wordIndex = WORD_INDEX;
  const encode = STRING_FROM_CHARCODE;

  let value = subject;
  let codes = null;
  let codeLength;
  let code;
  let c;
  let length;
  let isWordBefore;
  let isWord;

  switch (typeof subject) {
  case TYPE_NUMBER:
    return IS_FINITE(subject) ? string(subject) : empty;

  case TYPE_BIGINT:
    value = string(value);
    break;

  // falls through
  case TYPE_STRING:
    if (value) {
      break;
    }

  // falls through
  default:
    return empty;
  }

  codes = [];
  codeLength = 0;
  isWordBefore = true;

  for (c = 0, length = value.length; length--; c++) {
    code = value.charCodeAt(c);
    isWord = code in wordIndex;

    if (isWord) {
      // capitalize
      if (!isWordBefore && wordIndex[code] === 2) {
        code = encode(code).toUpperCase().charCodeAt(0);
      }

      codes[codeLength++] = code;
    }

    isWordBefore = isWord;
  }

  return encode.apply(null, codes);
}
