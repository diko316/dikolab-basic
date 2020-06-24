import { EMPTY_STRING } from "../native/constants";

import { DEFAULT_PADSTRING } from "./constants";

import { stringify } from "./stringify";

import { listPadStart } from "../array/service";

/**
 * Creates a padded string with another string (multiple times, if needed)
 * until the resulting string reaches the given length.
 * The padding is applied from the start of the string.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart}
 * @param {string} subject The string to pad.
 * @param {number} length The length of the resulting string once it has been padded.
 * @param {string} padString The string to pad the current string with.
 * @returns {string} string of the specified length with the pad string applied from the start.
 */
export function padStart(subject, length = 0, padString = DEFAULT_PADSTRING) {
  return listPadStart(
    stringify(subject),
    length,
    padString
  ).join(EMPTY_STRING);
}
