import { stringify } from "../string/stringify";
import { UNICODE_CODEPOINT_MATCH_REGEXP } from "./constants";

/**
 * Splits string into collection of Unicode code points.
 *
 * @param {string} subject String to split.
 * @returns {number[]} list of codePoints.
 */
export function stringToCodePoints(subject) {
  const string = stringify(subject);
  const found = [];
  let length = 0;

  if (string) {
    string.replace(
      UNICODE_CODEPOINT_MATCH_REGEXP,
      (char) => {
        found[length++] = char.length === 1
          ? char.charCodeAt(0)
          : (char.charCodeAt(0) - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000;
      }
    );
  }

  return found;
}
