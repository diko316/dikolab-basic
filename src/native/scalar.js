import {
  TYPE_BIGINT,
  TYPE_SYMBOL,
  TYPE_STRING,
  TYPE_BOOLEAN,
  TYPE_NUMBER
} from "./constants";

import { IS_FINITE } from "./number";

/**
 * Returns true. if "subject" parameter is Scalar string, number, boolean, symbol, or bigint.
 *
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function scalar(subject) {
  switch (typeof subject) {
  case TYPE_BIGINT:
  case TYPE_SYMBOL:
  case TYPE_STRING:
  case TYPE_BOOLEAN: return true;

  case TYPE_NUMBER: return IS_FINITE(subject);
  }

  return false;
}
