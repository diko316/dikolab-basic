import { stringify } from "../string/stringify";

import { UNICODE_CODEPOINT_MATCH_REGEXP } from "./constants";

/**
 * Splits string into collection of Unicode characters.
 *
 * @param {string} subject String to split.
 * @returns {string[]} list of unicode characters.
 */
export function stringToUnicodes(subject) {
  const string = stringify(subject);
  const found = [];
  let length = 0;

  if (string) {
    string.replace(
      UNICODE_CODEPOINT_MATCH_REGEXP,
      (char) => {
        found[length++] = char;
      }
    );
  }

  return found;
}
