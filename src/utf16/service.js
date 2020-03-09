import {
  EMPTY_STRING,
  TYPE_OBJECT,
  TYPE_STRING,
  TYPE_NUMBER
} from "../native/constants";

import {
  STRING_FROM_CHARCODE
} from "../native/string";

/**
 * The callback used to on each Utf-16 codePoint found.
 *
 * @callback eachCodePointCallback
 * @param {number} codePoint Utf-16 codePoint
 * @param {string} chars string representation of codePoint
 */

/**
 * Iterates Utf-16 codePoints of string and execute callback on each codePoint found.
 *
 * @category Types
 * @function module:utf16.eachU16
 * @param {string} subject string to iterate.
 * @param {eachCodePointCallback} callback The callback to execute on each codePoint.
 * @returns {number} number of codePoints found
 */
export function eachU16(subject, callback) {
  const empty = EMPTY_STRING;
  const fromCharCode = STRING_FROM_CHARCODE;
  const type = typeof subject;
  const lengthProperty = subject !== null && (type === TYPE_OBJECT || type === TYPE_STRING) ? subject.length : null;
  let index = 0;

  if (typeof lengthProperty !== TYPE_NUMBER || !isFinite(lengthProperty) || lengthProperty < 0) {
    return 0;
  }

  for (let c = 0, length = subject.length; length--; c++) {
    let first = 0;
    let second = 0;
    let code = empty;

    first = subject.charCodeAt(c);
    if (first < 0xD800 || first > 0xDBFF || c === length) {
      callback(first, fromCharCode(first), index++);
      continue;
    }

    second = subject.charCodeAt(c + 1);
    if (second < 0xDC00 || second > 0xDFFF) { // not low surrogate
      callback(first, fromCharCode(first), index++);
      continue;
    }

    // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
    c++;
    length--;
    code = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    callback(
      code,
      fromCharCode(first) + fromCharCode(second),
      index++
    );
  }

  return index;
}

/**
 * Creates string with given list of codePoints.
 *
 * @function module:utf16.codePoint2string
 * @param {number} code list of codePoints.
 * @returns {string} the string created based from codePoints list.
 */
export function codePoint2string(code) {
  const finite = isFinite;
  const fromCharCode = STRING_FROM_CHARCODE;
  let value = 1 * code;

  if (!finite(value) || value < 0 || value > 0x10FFFF) {
    console.warn(RangeError(`Invalid code point: ${code}`));
    return EMPTY_STRING;
  }

  if (value > 0xFFFF) {
    value -= 0x10000;
    return fromCharCode(
      (value >> 10) + 0xD800,
      (value % 0x400) + 0xDC00
    );
  }

  return fromCharCode(value);
}
