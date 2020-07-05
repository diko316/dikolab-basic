import { EMPTY_STRING } from "../native/constants";

import { STRING_TRIM_RIGHT_REGEXP } from "./constants";

import { stringifyScalar } from "./stringify-scalar";

/**
 * Removes ending whitespace.
 *
 * @param {string} subject The string to trim.
 * @returns {string} Whitespace trimmed string.
 */
export function trimEnd(subject) {
  const value = stringifyScalar(subject);

  return value && value.replace(STRING_TRIM_RIGHT_REGEXP, EMPTY_STRING);
}
