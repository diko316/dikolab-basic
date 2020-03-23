import { method } from "../native/type";

import { IS_FINITE } from "../native/number";

import { EMPTY_STRING } from "../native/constants";

import {
  STRING_FROM_CHARCODE
} from "../native/string";

import { stringify } from "../string/type";

import {
  UNICODE_CODEPOINT_MATCH_REGEXP
} from "./constants";

/**
 * Splits string into collection of Unicode characters.
 *
 * @param {string} subject String to split.
 * @returns {string[]} list of unicode characters.
 */
export function string2unicodes(subject) {
  const string = stringify(subject);
  const found = [];
  let length = 0;

  if (string) {
    string.replace(
      UNICODE_CODEPOINT_MATCH_REGEXP,
      (char) => {
        found[length++] = char;
      }
    );
  }

  return found;
}

/**
 * Splits string into collection of Unicode code points.
 *
 * @param {string} subject String to split.
 * @returns {number[]} list of codePoints.
 */
export function string2codePoints(subject) {
  const string = stringify(subject);
  const found = [];
  let length = 0;

  if (string) {
    string.replace(
      UNICODE_CODEPOINT_MATCH_REGEXP,
      (char) => {
        found[length++] = char.length === 1 ? char.charCodeAt(0)
          : (char.charCodeAt(0) - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000;
      }
    );
  }

  return found;
}

/**
 * The callback used on each Unicode codePoint found.
 *
 * @callback eachCodePointCallback
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

  if (!method(callback)) {
    return length;
  }

  string = string2unicodes(subject);
  length = foundLength = string.length;

  for (; length--; c++) {
    char = string[c];
    callback(
      char.length === 1 ? char.charCodeAt(0)
        : (char.charCodeAt(0) - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000,
      char,
      c
    );
  }

  return foundLength;
}

/**
 * Creates string with given list of codePoints.
 *
 * @param {...number[]} codes codePoint to convert to string.
 * @returns {string} the string created based from codePoints list.
 */
export function codePoint2string(...codes) {
  const fromCharCode = STRING_FROM_CHARCODE;
  const finite = IS_FINITE;
  const empty = EMPTY_STRING;
  const found = [];
  let foundLength = 0;
  let c = 0;
  let length = codes.length;
  let value = null;
  let code = null;

  if (!length) {
    return empty;
  }

  for (; length--; c++) {
    code = codes[c];
    value = 1 * code;

    if (!finite(value) || value < 0 || value > 0x10FFFF) {
      console.warn(RangeError(`Invalid code point: ${code}`));
      return empty;
    }

    if (value > 0xFFFF) {
      value -= 0x10000;
      found[foundLength++] = fromCharCode(
        (value >> 10) + 0xD800,
        (value % 0x400) + 0xDC00
      );
    }
    else {
      found[foundLength++] = fromCharCode(value);
    }
  }

  return found.join(empty);
}
