import {
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_BOOLEAN,
  TYPE_FUNCTION,

  BOOLEAN_TRUE,
  BOOLEAN_FALSE,
  EMPTY_STRING
} from "../native";

import { numberify } from "../number/format";

/**
 * Convert Any value to string. Or return "defaultValue" parameter.
 *
 * @function module:string.stringify
 * @param {*} subject data to convert to string.
 * @param {*} [defaultValue=""] fallback value to return if conversion fails.
 * @returns {string|*} returns defaultValue if unable to convert to string.
 */
export function stringify(subject, defaultValue = EMPTY_STRING) {
  const empty = EMPTY_STRING;

  switch (typeof subject) {
  case TYPE_BOOLEAN: return subject ? BOOLEAN_TRUE : BOOLEAN_FALSE;
  case TYPE_NUMBER:
    return isFinite(subject) ? empty + subject : defaultValue;
  case TYPE_STRING: return subject;
  case TYPE_FUNCTION: return defaultValue;
  }

  return String(subject);
}

/**
 * Returns repeated string "subject" in "count" number of times.
 *
 * @function module:string.repeat
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
