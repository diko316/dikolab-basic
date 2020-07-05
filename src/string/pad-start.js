import { EMPTY_STRING } from "../native/constants";

import { DEFAULT_PADSTRING } from "./constants";

import { listPadStart } from "../array/list-pad-start";

import { stringToUnicodes } from "../unicode/string-to-unicodes";

import { stringifyScalar } from "./stringify-scalar";

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
  const toUnicodes = stringToUnicodes;

  let value = stringifyScalar(subject);
  let pad = stringifyScalar(padString);

  if (!value) {
    return value;
  }

  value = toUnicodes(value);
  pad = toUnicodes(pad);

  return listPadStart(value, length, pad).join(EMPTY_STRING);
}
