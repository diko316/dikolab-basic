import { stringify } from "../string/stringify";
import { UNICODE_CODEPOINT_MATCH_REGEXP } from "./constants";
import { Utf } from "./utf.class";

/**
 * Safely counts number of Utf characters.
 *
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
