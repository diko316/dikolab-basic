import {
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_BOOLEAN,
  TYPE_SYMBOL,

  BOOLEAN_TRUE,
  BOOLEAN_FALSE,
  EMPTY_STRING
} from "../native/constants";

import {
  MATH_RANDOM,
  MATH_ROUND
} from "../native/math";

import {
  STRING
} from "../native/string";

/**
 * Convert Any value to string. Or return "defaultValue" parameter.
 *
 * @category String
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
  case TYPE_SYMBOL:
    return [
      STRING(subject),
      "[",
      (new Date()).getTime().toString(16),
      MATH_ROUND(MATH_RANDOM() * 1000).toString(16),
      "]"
    ].join(empty);
  }

  return defaultValue;
}
