import {
  EMPTY_STRING,
  TYPE_BIGINT,
  TYPE_NUMBER
} from "../native/constants";

import { PARSE_INT } from "../native/number";

import { stringifyScalar } from "./stringify-scalar";

/**
 * Returns repeated string "subject" in "count" number of times.
 *
 * @param {string} subject any data convertible to string.
 * @param {number} count number of times to repeat.
 * @returns {string} Returns empty string if unable to repeat.
 */
export function repeat(subject, count) {
  const value = stringifyScalar(subject);
  let list = null;
  let length = count;

  if (!value) {
    return value;
  }

  switch (typeof length) {
  case TYPE_BIGINT:
    length = PARSE_INT(length, 10);

  // falls through
  case TYPE_NUMBER:
    if (length > 0) {
      break;
    }

  // falls through
  default:
    return value;
  }

  list = [value];

  for (let c = 1; length--; c++) {
    list[c] = value;
  }

  return list.join(EMPTY_STRING);
}
