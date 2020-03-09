import {
  EMPTY_STRING,
  EMPTY_FUNCTION,
  TYPE_NUMBER,
  TYPE_STRING
} from "../native/constants";

import {
  stringify
} from "../string/format";

import { array } from "../native/type";

import {
  CODE_POINTS_TO_UTF16_ERROR,
  CODE_POINT_TO_STRING_ERROR
} from "./constants";

import {
  eachU16,
  codePoint2string
} from "./service";

import {
  Utf16,
  EMPTY_UTF16
} from "./Utf16";

/**
 * Convert Scalar value to Utf16 string.
 *
 * @function module:utf16.utf16inify
 * @param {*} subject Scalar value to convert.
 * @param {*} [defaultValue=Utf16] optional defaultValue to return if failed.
 * @returns {Utf16|*} Utf16 string when successful, or "defaultValue" if failed.
 */
export function utf16inify(subject, defaultValue = EMPTY_UTF16) {
  const stringified = stringify(subject, null);

  return stringified === null ? defaultValue : new Utf16(stringified);
}

/**
 * Create Utf16 based on Array of code points parameter.
 * Error will be thrown if parameter is invalid.
 *
 * @function module:utf16.codepoints2utf16
 * @param {number[]} codes Array of code points.
 * @returns {Utf16} Utf16 instance.
 */
export function codepoints2utf16(codes) {
  const finite = isFinite;
  const transform = codePoint2string;
  const typeNumber = TYPE_NUMBER;
  const result = [];

  if (!array(codes)) {
    throw new Error(CODE_POINTS_TO_UTF16_ERROR);
  }

  for (let c = 0, length = codes.length; length--; c++) {
    const code = codes[c];

    if (typeof code !== typeNumber || !finite(code)) {
      throw new Error(CODE_POINT_TO_STRING_ERROR);
    }

    result[c] = transform(code);
  }

  return new Utf16(result.join(EMPTY_STRING));
}

/**
 * Safely counts number of Utf16 characters.
 *
 * @function module:utf16.utf16Count
 * @param {string|Utf16} subject String or Utf16 to count.
 * @returns {number} returns number of resolved Utf16 characters. or zero (0)
 */
export function utf16count(subject) {
  if (typeof subject === TYPE_STRING) {
    return subject ? eachU16(subject, EMPTY_FUNCTION) : EMPTY_STRING;
  }

  if (subject instanceof Utf16) {
    return subject.length;
  }

  return 0;
}
