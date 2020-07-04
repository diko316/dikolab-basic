import {
  TYPE_STRING,
  TYPE_BIGINT,
  TYPE_NUMBER
} from "../native/constants";

import { IS_FINITE } from "../native/number";

import { STRING } from "../native/string";

import { UNICODE_CODEPOINT_MATCH_REGEXP } from "./constants";

/**
 * Safely counts number of Utf characters.
 *
 * @param {string} subject String or Utf to count.
 * @returns {number} returns number of resolved Utf characters. or zero (0)
 */
export function unicodeCount(subject) {
  switch (typeof subject) {
  case TYPE_NUMBER: return IS_FINITE(subject) ? STRING(subject).length : 0;
  case TYPE_BIGINT: return STRING(subject).length;
  case TYPE_STRING:
    return subject
      ? subject.replace(UNICODE_CODEPOINT_MATCH_REGEXP, "-").length
      : 0;
  }

  return 0;
}
