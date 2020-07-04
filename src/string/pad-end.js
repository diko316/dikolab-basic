import {
  EMPTY_STRING,
  TYPE_STRING,
  TYPE_BIGINT,
  TYPE_NUMBER
} from "../native/constants";

import { STRING } from "../native/string";

import { IS_FINITE } from "../native/number";

import { DEFAULT_PADSTRING } from "./constants";

import { stringToUnicodes } from "../unicode/string-to-unicodes";

import { listPadEnd } from "../array/list-pad-end";

/**
 * Creates a padded string with another string (multiple times, if needed)
 * until the resulting string reaches the given length.
 * The padding is applied from the end of the string.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd}
 * @param {string} subject The string to pad.
 * @param {number} length The length of the resulting stringe once it has been padded.
 * @param {string} padString The string to pad the current string with.
 * @returns {string} string of the specified length with the pad string applied from the end.
 */
export function padEnd(subject, length = 0, padString = DEFAULT_PADSTRING) {
  const finite = IS_FINITE;
  const typeNumber = TYPE_NUMBER;
  const typeBigInt = TYPE_BIGINT;
  const typeString = TYPE_STRING;
  const string = STRING;
  const toUnicodes = stringToUnicodes;
  const empty = EMPTY_STRING;

  let value = subject;
  let pad = padString;

  switch (typeof value) {
  case typeNumber:
    if (!finite(value)) {
      return empty;
    }

  // falls through
  case typeBigInt:
    value = string(value);

  // falls through
  case typeString:
    value = toUnicodes(value);
    break;

  default:
    return empty;
  }

  if (pad !== DEFAULT_PADSTRING) {
    switch (typeof pad) {
    case typeNumber:
      if (!finite(pad)) {
        return value;
      }
    // falls through
    case typeBigInt:
      pad = STRING(pad);

    // falls through
    case typeString:
      pad = toUnicodes(pad);
      break;

    default:
      return value;
    }
  }

  return listPadEnd(value, length, pad).join(empty);
}
