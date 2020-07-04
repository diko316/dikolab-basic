import {
  EMPTY_STRING,
  TYPE_STRING,
  TYPE_BIGINT,
  TYPE_NUMBER
} from "../native/constants";

import { STRING } from "../native/string";

import { IS_FINITE } from "../native/number";

/**
 * Returns repeated string "subject" in "count" number of times.
 *
 * @param {string} subject any data convertible to string.
 * @param {number} count number of times to repeat.
 * @returns {string} Returns empty string if unable to repeat.
 */
export function repeat(subject, count) {
  const finite = IS_FINITE;
  const typeNumber = TYPE_NUMBER;
  const empty = EMPTY_STRING;
  let value = subject;
  let list = null;
  let length;

  switch (typeof value) {
  case typeNumber:
    if (!finite(value)) {
      return empty;
    }

  // falls through
  case TYPE_BIGINT:
    value = STRING(value);
    break;

  case TYPE_STRING:
    if (value) {
      break;
    }

  // falls through
  default:
    return empty;
  }

  switch (typeof count) {
  case typeNumber:
    if (finite(count)) {
      break;
    }

  // falls through
  default:
    return value;
  }

  list = [value];
  length = count;

  for (let c = 1; length--; c++) {
    list[c] = value;
  }

  return list.join(empty);
}
