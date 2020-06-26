import {
  TYPE_STRING,
  TYPE_OBJECT
} from "./constants";

import { IS_FINITE } from "./number";

/**
 * Returns true if [subject] is an object with zero-based index
 * properties and length number of items.
 *
 * @param {*} subject value to test.
 * @returns {boolean} result
 */
export function iteratable(subject) {
  switch (typeof subject) {
  case TYPE_STRING: return true;
  case TYPE_OBJECT:
    return subject !== null && IS_FINITE(subject.length);
  }

  return false;
}
