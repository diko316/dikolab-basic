import {
  TYPE_STRING,
  TYPE_BIGINT,
  TYPE_NUMBER,
  EMPTY_STRING
} from "../native/constants";

import { IS_FINITE } from "../native/number";

import { STRING } from "../native/string";

import { STRING_TRIM_RIGHT_REGEXP } from "./constants";

/**
 * Removes ending whitespace.
 *
 * @param {string} subject The string to trim.
 * @returns {string} Whitespace trimmed string.
 */
export function trimEnd(subject) {
  const string = STRING;
  const empty = EMPTY_STRING;

  switch (typeof subject) {
  case TYPE_BIGINT:
    return string(subject);

  case TYPE_NUMBER:
    return IS_FINITE(subject) ? string(subject) : empty;

  case TYPE_STRING:
    if (subject) {
      break;
    }

  // falls through
  default:
    return empty;
  }

  return subject.replace(STRING_TRIM_RIGHT_REGEXP, EMPTY_STRING);
}
