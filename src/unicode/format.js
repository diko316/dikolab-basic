import {
  stringify
} from "../string/format";

import { array } from "../native/type";

import {
  CODE_POINTS_TO_UTF_ERROR,
  UNICODE_CODEPOINT_MATCH_REGEXP
} from "./constants";

import { codePoint2string } from "./service";

import {
  Utf,
  EMPTY_UNICODE
} from "./Utf";

/**
 * Convert Scalar value to Unicode.
 *
 * @function module:basic.unicodify
 * @param {*} subject Scalar value to convert.
 * @param {*} [defaultValue=Utf] optional defaultValue to return if failed.
 * @returns {Utf|*} Unicode string when successful, or "defaultValue" if failed.
 */
export function unicodify(subject, defaultValue = EMPTY_UNICODE) {
  const stringified = stringify(subject, null);

  return stringified === null ? defaultValue : new Utf(stringified);
}

/**
 * Create Utf based on Array of code points parameter.
 * Error will be thrown if parameter is invalid.
 *
 * @function module:basic.codepoints2Utf
 * @param {number[]} codes Array of code points.
 * @returns {Utf} Utf instance.
 */
export function codepoints2Utf(codes) {
  if (!array(codes)) {
    throw new Error(CODE_POINTS_TO_UTF_ERROR);
  }

  return new Utf(
    codePoint2string(...codes)
  );
}

/**
 * Safely counts number of Utf characters.
 *
 * @function module:basic.unicodeCount
 * @param {string|Utf} subject String or Utf to count.
 * @returns {number} returns number of resolved Utf characters. or zero (0)
 */
export function unicodeCount(subject) {
  let string = null;

  if (subject instanceof Utf) {
    return subject.length;
  }

  string = stringify(subject);
  if (string) {
    return string.replace(UNICODE_CODEPOINT_MATCH_REGEXP, "-").length;
  }

  return 0;
}
