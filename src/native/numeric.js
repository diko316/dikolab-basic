import {
  TYPE_STRING,
  TYPE_NUMBER
} from "./constants";

import { NUMERIC_REGEXP } from "./number";

/**
 * Returns true. if "subject" parameter is Numeric string, number, or bigint.
 *
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function numeric(subject) {
  switch (typeof subject) {
  case TYPE_STRING:
  case TYPE_NUMBER:
    return NUMERIC_REGEXP.test(subject);
  }

  return false;
}
