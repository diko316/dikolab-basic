import {
  TYPE_STRING,
  EMPTY_STRING
} from "../native/constants";

import { STRING_FROM_CHARCODE } from "../native/string";

import { words as WORD_INDEX } from "./utf-constants.json";

/**
 * Converts camel case string to snake case.
 * Take note that this will also UTF-8 safe.
 *
 * @param {string} subject - Camel-case string to convert.
 * @param {string} [filler="-"] - Word boundary character to use.
 * @returns {string} snake-cased string.
 */
export function uncamelize(subject, filler = "-") {
  const empty = EMPTY_STRING;
  const wordIndex = WORD_INDEX;
  const typeString = TYPE_STRING;
  const encode = STRING_FROM_CHARCODE;

  let chars = null;
  let charLength;
  let code;
  let c;
  let length;
  let isWordBefore = true;
  let isUppercased = false;
  let isWord;

  if (!subject || typeof subject !== typeString || typeof filler !== typeString) {
    return empty;
  }

  chars = [];
  charLength = 0;

  for (c = 0, length = subject.length; length--; c++) {
    code = subject.charCodeAt(c);
    isWord = code in wordIndex;

    if (isWord) {
      isUppercased = wordIndex[code] === 1;

      // add filler
      if (!isWordBefore || isUppercased) {
        chars[charLength++] = filler;
      }

      code = encode(code);

      // insert
      chars[charLength++] = isUppercased ? code.toLowerCase() : code;
    }

    isWordBefore = isWord;
  }

  return chars.join(empty);
}
