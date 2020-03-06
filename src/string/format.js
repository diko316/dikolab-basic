import { EMPTY_STRING } from "../native";
import { numberify } from "../number/type-cast";

import {
  stringify
} from "./type-cast";

/**
 * Returns repeated string "subject" in "count" number of times.
 *
 * @alias module:string.repeat
 * @param {string} subject any data convertible to string.
 * @param {number} count number of times to repeat.
 * @returns {string} Returns empty string if unable to repeat.
 */
export function repeat(subject, count) {
  const empty = EMPTY_STRING;
  const value = stringify(subject, empty);
  let length = numberify(count, 0);
  let list = null;

  if (!value || length < 2) {
    return value;
  }

  list = [];

  for (let c = 0; length--; c++) {
    list[c] = value;
  }

  return list.join(empty);
}

// export function trim() {
// }

// export function trimBefore() {
// }

// export function trimAfter() {
// }
