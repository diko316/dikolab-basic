import { EMPTY_STRING } from "../native/constants";

import { STRING_FROM_CHARCODE } from "../native/string";

import { DEFAULT_CAMELIZE_FILLER } from "./constants";

import { words as WORD_INDEX } from "./utf-constants.json";

import { stringifyScalar } from "./stringify-scalar";

/**
 * Converts camel case string to snake case.
 * Take note that this will also UTF-8 safe.
 *
 * @param {string} subject - Camel-case string to convert.
 * @param {string} [filler="-"] - Word boundary character to use.
 * @returns {string} snake-cased string.
 */
export function uncamelize(subject, filler = DEFAULT_CAMELIZE_FILLER) {
  const value = stringifyScalar(subject);
  const wordIndex = WORD_INDEX;
  const encode = STRING_FROM_CHARCODE;

  let fillerValue = null;
  let chars = null;
  let charLength;
  let code;
  let c;
  let length;
  let isWordBefore = true;
  let isUppercased = false;
  let isWord;

  if (!value) {
    return value;
  }

  fillerValue = stringifyScalar(filler);
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

  return chars.join(EMPTY_STRING);
}
