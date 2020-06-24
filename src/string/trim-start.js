import {
  TYPE_STRING,
  EMPTY_STRING
} from "../native/constants";

import {
  STRING_TRIM_LEFT_REGEXP,
  TRIM_ERROR_NOT_STRING
} from "./constants";

/**
 * Removes starting white spaces.
 *
 * @param {string} subject The string to trim.
 * @returns {string} Whitespace trimmed string.
 */
export function trimStart(subject) {
  if (typeof subject !== TYPE_STRING) {
    throw new TypeError(TRIM_ERROR_NOT_STRING);
  }

  return subject && subject.replace(STRING_TRIM_LEFT_REGEXP, EMPTY_STRING);
}
