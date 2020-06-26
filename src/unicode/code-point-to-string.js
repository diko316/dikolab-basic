import { EMPTY_STRING } from "../native/constants";

import { IS_FINITE } from "../native/number";

import { STRING_FROM_CHARCODE } from "../native/string";

/**
 * Creates string with given list of codePoints.
 *
 * @param {...number[]} codes codePoint to convert to string.
 * @returns {string} the string created based from codePoints list.
 */
export function codePointToString(...codes) {
  const fromCharCode = STRING_FROM_CHARCODE;
  const finite = IS_FINITE;
  const empty = EMPTY_STRING;
  const found = [];
  let foundLength = 0;
  let c = 0;
  let length = codes.length;
  let value = null;
  let code = null;

  if (!length) {
    return empty;
  }

  for (; length--; c++) {
    code = codes[c];
    value = 1 * code;

    if (!finite(value) || value < 0 || value > 0x10FFFF) {
      console.warn(RangeError(`Invalid code point: ${code}`));
      return empty;
    }

    if (value > 0xFFFF) {
      value -= 0x10000;
      found[foundLength++] = fromCharCode(
        (value >> 10) + 0xD800,
        (value % 0x400) + 0xDC00
      );
    }
    else {
      found[foundLength++] = fromCharCode(value);
    }
  }

  return found.join(empty);
}
