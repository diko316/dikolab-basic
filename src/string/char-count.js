import { STRING } from "../native/string";
import { IS_FINITE } from "../native/number";
import { TYPE_NUMBER, TYPE_BIGINT, TYPE_STRING } from "../native/constants";
import { UNICODE_CODEPOINT_MATCH_REGEXP } from "../unicode/constants";

/**
 * UTF-safe Count number of characters in string.
 *
 * @param {string} subject String to count.
 * @returns {number} The number of characters.
 */
export function charCount(subject) {
  let value = subject;

  switch (typeof value) {
  case TYPE_NUMBER:
    if (!IS_FINITE(value)) {
      return 0;
    }
  // falls through
  case TYPE_BIGINT:
    value = STRING(value);

  // falls through
  case TYPE_STRING:
    return value.replace(UNICODE_CODEPOINT_MATCH_REGEXP, "_").length;
  }
  return 0;
}
