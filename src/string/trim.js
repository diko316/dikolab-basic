import { EMPTY_STRING } from "../native/constants";

import {
  STRING_TRIM_LEFT_REGEXP,
  STRING_TRIM_RIGHT_REGEXP
} from "./constants";

import { stringifyScalar } from "./stringify-scalar";

/**
 * Removes starting and ending white spaces.
 *
 * @param {string} subject The string to trim.
 * @returns {string} Whitespace trimmed string.
 */
export function trim(subject) {
  const empty = EMPTY_STRING;
  const value = stringifyScalar(subject);

  return value && value
    .replace(STRING_TRIM_LEFT_REGEXP, empty)
    .replace(STRING_TRIM_RIGHT_REGEXP, empty);
}
