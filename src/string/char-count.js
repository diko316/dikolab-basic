import { stringifyScalar } from "./stringify-scalar";
import { UNICODE_CODEPOINT_MATCH_REGEXP } from "../unicode/constants";

/**
 * UTF-safe Count number of characters in string.
 *
 * @param {string} subject String to count.
 * @returns {number} The number of characters.
 */
export function charCount(subject) {
  const value = stringifyScalar(subject);

  return value
    ? value.replace(UNICODE_CODEPOINT_MATCH_REGEXP, "_").length
    : 0;
}
