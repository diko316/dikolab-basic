import {
  TYPE_STRING,
  TYPE_NUMBER,
  TYPE_BIGINT,
  EMPTY_STRING
} from "../native/constants";

import { IS_FINITE } from "../native/number";

import { STRING } from "../native/string";

import { STRING_TRIM_LEFT_REGEXP } from "./constants";

/**
 * Removes starting white spaces.
 *
 * @param {string} subject The string to trim.
 * @returns {string} Whitespace trimmed string.
 */
export function trimStart(subject) {
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

  return subject.replace(STRING_TRIM_LEFT_REGEXP, EMPTY_STRING);
}
