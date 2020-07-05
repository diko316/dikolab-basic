import {
  ESCAPED_SINGLE_QUOTE,
  SINGLE_QUOTE,
  ESCAPED_DOUBLE_QUOTE,
  DOUBLE_QUOTE_ESCAPE,
  DOUBLE_QUOTE
} from "./constants";

import { stringifyScalar } from "./stringify-scalar";

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
  const value = stringifyScalar(subject);

  return value && value.replace(DOUBLE_QUOTE_ESCAPE, quoteReplace);
}
