import {
  TYPE_STRING,
  TYPE_NUMBER,
  TYPE_BIGINT,
  EMPTY_STRING
} from "../native/constants";

import { IS_FINITE } from "../native/number";

import {
  ESCAPED_SINGLE_QUOTE,
  SINGLE_QUOTE,
  ESCAPED_DOUBLE_QUOTE,
  DOUBLE_QUOTE_ESCAPE,
  DOUBLE_QUOTE
} from "./constants";

import { STRING } from "../native/string";

function quoteReplace(all) {
  switch (all) {
  case ESCAPED_SINGLE_QUOTE: return SINGLE_QUOTE;
  case DOUBLE_QUOTE: return ESCAPED_DOUBLE_QUOTE;
  }
  return all;
}

/**
 * Escapes characters to make it safe to enclose it in a double quote.
 *
 * @param {string} subject String to apply double quote escape.
 * @returns {string} Escaped string.
 */
export function quoteEscape(subject) {
  const empty = EMPTY_STRING;
  let value = subject;

  switch (typeof value) {
  case TYPE_NUMBER:
    if (!IS_FINITE(value)) {
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

  return value.replace(DOUBLE_QUOTE_ESCAPE, quoteReplace);
}
