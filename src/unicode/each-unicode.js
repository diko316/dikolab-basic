import { TYPE_FUNCTION } from "../native/constants";

import { stringToUnicodes } from "./string-to-unicodes";

/**
 * The callback used on each Unicode codePoint found.
 *
 * @typedef {function} eachCodePointCallback
 * @param {number} codePoint Unicode codePoint.
 * @param {string} chars string representation of codePoint.
 * @param {number} index Unicode character zero based index position.
 */

/**
 * Iterates Unicode codePoints of string that executes callback on each codePoint found.
 *
 * @param {string} subject string to iterate.
 * @param {eachCodePointCallback} callback The callback to execute on each codePoint.
 * @returns {number} number of codePoints found
 */
export function eachUnicode(subject, callback) {
  let char = null;
  let c = 0;
  let length = 0;
  let foundLength = 0;
  let string = null;

  if (typeof callback !== TYPE_FUNCTION) {
    return length;
  }

  string = stringToUnicodes(subject);
  length = foundLength = string.length;

  for (; length--; c++) {
    char = string[c];
    callback(
      char.length === 1
        ? char.charCodeAt(0)
        : (char.charCodeAt(0) - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000,
      char,
      c
    );
  }

  return foundLength;
}
