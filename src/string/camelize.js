import {
  TYPE_STRING,
  EMPTY_STRING
} from "../native/constants";

import { STRING_FROM_CHARCODE } from "../native/string";

import { words as WORD_INDEX } from "./utf-constants.json";

/**
 * Converts snake case string to camel case.
 * Take note that this will also UTF-8 safe.
 *
 * @param {string} subject Snake-case string to convert.
 * @returns {string} camel-cased string.
 */
export function camelize(subject) {
  const empty = EMPTY_STRING;
  const wordIndex = WORD_INDEX;
  const encode = STRING_FROM_CHARCODE;

  let codes = null;
  let codeLength;
  let code;
  let c;
  let length;
  let isWordBefore;
  let isWord;

  if (!subject || typeof subject !== TYPE_STRING) {
    return empty;
  }

  codes = [];
  codeLength = 0;
  isWordBefore = true;

  for (c = 0, length = subject.length; length--; c++) {
    code = subject.charCodeAt(c);
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
