import {
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_BOOLEAN,

  BOOLEAN_TRUE,
  BOOLEAN_FALSE,
  EMPTY_STRING,
  TYPE_BIGINT
} from "../native/constants";

import { IS_FINITE } from "../native/number";

import { STRING } from "../native/string";

/**
 * Convert Any value to string. Or return "defaultValue" parameter.
 *
 * @category String
 * @param {*} subject data to convert to string.
 * @param {*} [defaultValue=""] fallback value to return if conversion fails.
 * @returns {string|*} returns defaultValue if unable to convert to string.
 */
export function stringify(subject, defaultValue = EMPTY_STRING) {
  const string = STRING;

  switch (typeof subject) {
  case TYPE_BOOLEAN:
    return subject ? BOOLEAN_TRUE : BOOLEAN_FALSE;

  case TYPE_BIGINT:
    return string(subject);

  case TYPE_NUMBER:
    return IS_FINITE(subject) ? string(subject) : defaultValue;

  case TYPE_STRING: return subject;
  }

  return defaultValue;
}
