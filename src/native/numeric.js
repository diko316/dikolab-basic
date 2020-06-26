import {
  TYPE_STRING,
  TYPE_NUMBER,
  TYPE_BIGINT
} from "./constants";

import { IS_FINITE } from "./number";

/**
 * Returns true. if "subject" parameter is Numeric string, number, or bigint.
 *
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function numeric(subject) {
  let result = subject;

  switch (typeof result) {
  case TYPE_STRING:
    result = parseInt(result, 10);

  // falls through
  case TYPE_NUMBER:
    return IS_FINITE(result);

  case TYPE_BIGINT: return true;
  }

  return false;
}
