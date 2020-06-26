import { MATH_MAX } from "../native/math";

import { padInfo } from "./pad-info";

/**
 * Creates a padded Array with another Iteratable (multiple times, if needed)
 * until the resulting Iteratable reaches the given length.
 * The padding is applied from the start of the Iteratable.
 *
 * @param {Iteratable} subject The iteratable to pad.
 * @param {number} pad The length of the resulting Iteratable once it has been padded.
 * @param {Iteratable} padList The string to pad the current Utf instance with.
 * @returns {Array} Utf instance of the specified length with the pad string applied from the start.
 */
export function listPadStart(subject, pad, padList) {
  const max = MATH_MAX;
  const info = padInfo(subject, pad, padList);
  const main = info[0];
  const total = info[1];
  const list = info[2];
  const result = [];
  const padLength = list.length;
  const mainLength = main.length;
  let length = max(
    0,
    max(
      mainLength,
      padLength,
      total
    ) - mainLength
  );
  let resultLength = 0;
  let c = 0;

  for (; length--; c++) {
    result[resultLength++] = list[c % padLength];
  }

  result.push.apply(result, main);

  return result;
}
