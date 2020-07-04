import {
  TYPE_STRING,
  TYPE_NUMBER,
  TYPE_BIGINT,
  EMPTY_STRING
} from "../native/constants";

import {
  STRING,
  STRING_FROM_CHARCODE
} from "../native/string";

import { IS_FINITE } from "../native/number";

import { DEFAULT_CAMELIZE_FILLER } from "./constants";

import { words as WORD_INDEX } from "./utf-constants.json";

/**
 * Converts camel case string to snake case.
 * Take note that this will also UTF-8 safe.
 *
 * @param {string} subject - Camel-case string to convert.
 * @param {string} [filler="-"] - Word boundary character to use.
 * @returns {string} snake-cased string.
 */
export function uncamelize(subject, filler) {
  const string = STRING;
  const empty = EMPTY_STRING;
  const finite = IS_FINITE;
  const defaultFiller = DEFAULT_CAMELIZE_FILLER;
  const wordIndex = WORD_INDEX;
  const typeString = TYPE_STRING;
  const typeNumber = TYPE_NUMBER;
  const typeBigInt = TYPE_BIGINT;
  const encode = STRING_FROM_CHARCODE;

  let fillerValue = filler;
  let value = subject;
  let chars = null;
  let charLength;
  let code;
  let c;
  let length;
  let isWordBefore = true;
  let isUppercased = false;
  let isWord;

  switch (typeof value) {
  case typeNumber:
    return finite(value) ? string(value) : empty;

  case typeBigInt:
    value = string(value);
    break;

    // falls through
  case typeString:
    if (value) {
      break;
    }
  // falls through
  default:
    return empty;
  }

  switch (typeof fillerValue) {
  case typeNumber:
    if (!finite(fillerValue)) {
      fillerValue = defaultFiller;
      break;
    }

  // falls through
  case typeBigInt:
    fillerValue = string(fillerValue);
    break;

    // falls through
  case typeString:
    if (fillerValue) {
      break;
    }

  // falls through
  default:
    fillerValue = defaultFiller;
  }

  chars = [];
  charLength = 0;

  for (c = 0, length = value.length; length--; c++) {
    code = value.charCodeAt(c);
    isWord = code in wordIndex;

    if (isWord) {
      isUppercased = wordIndex[code] === 1;

      // add filler
      if (!isWordBefore || isUppercased) {
        chars[charLength++] = fillerValue;
      }

      code = encode(code);

      // insert
      chars[charLength++] = isUppercased ? code.toLowerCase() : code;
    }

    isWordBefore = isWord;
  }

  return chars.join(empty);
}
