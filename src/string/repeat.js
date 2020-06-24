import { EMPTY_STRING } from "../native/constants";

import { numberify } from "../number/format";

import { stringify } from "./stringify";

/**
 * Returns repeated string "subject" in "count" number of times.
 *
 * @param {string} subject any data convertible to string.
 * @param {number} count number of times to repeat.
 * @returns {string} Returns empty string if unable to repeat.
 */
export function repeat(subject, count) {
  const empty = EMPTY_STRING;
  const value = stringify(subject, empty);
  let length = numberify(count, 0);
  let list = null;

  if (!value || length < 1) {
    return value;
  }

  list = [];
  length++;

  for (let c = 0; length--; c++) {
    list[c] = value;
  }

  return list.join(empty);
}
