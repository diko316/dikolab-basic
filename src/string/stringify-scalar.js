import {
  TYPE_STRING,
  TYPE_NUMBER,
  TYPE_BIGINT,
  EMPTY_STRING
} from "../native/constants";

import { STRING } from "../native/string";

import { IS_FINITE } from "../native/number";

/**
 * Convert number and bigint to string. Returns subject parameter if string.
 * Or, returns empty string if subject parameter is doesn't match any of the
 * above data type.
 *
 * @private
 * @param {*} subject The data to type-cast
 * @returns {string} converted to string
 */
export function stringifyScalar(subject) {
  const string = STRING;

  switch (typeof subject) {
  case TYPE_STRING: return subject;
  case TYPE_BIGINT: return string(subject);
  case TYPE_NUMBER: return IS_FINITE(subject) ? string(subject) : "0";
  }

  return EMPTY_STRING;
}
