import {
  TYPE_STRING,
  EMPTY_STRING
} from "../native/constants";

import {
  STRING_TRIM_RIGHT_REGEXP,
  TRIM_ERROR_NOT_STRING
} from "./constants";

/**
 * Removes ending whitespace.
 *
 * @param {string} subject The string to trim.
 * @returns {string} Whitespace trimmed string.
 */
export function trimEnd(subject) {
  if (typeof subject !== TYPE_STRING) {
    throw new TypeError(TRIM_ERROR_NOT_STRING);
  }

  return subject && subject.replace(STRING_TRIM_RIGHT_REGEXP, EMPTY_STRING);
}
