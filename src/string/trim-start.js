import { EMPTY_STRING } from "../native/constants";

import { STRING_TRIM_LEFT_REGEXP } from "./constants";

import { stringifyScalar } from "./stringify-scalar";

/**
 * Removes starting white spaces.
 *
 * @param {string} subject The string to trim.
 * @returns {string} Whitespace trimmed string.
 */
export function trimStart(subject) {
  const value = stringifyScalar(subject);

  return value && value.replace(STRING_TRIM_LEFT_REGEXP, EMPTY_STRING);
}
