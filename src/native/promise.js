import {
  OBJECT_SIGNATURE,
  PROMISE_SIGNATURE,
  TYPE_FUNCTION
} from "./constants";

import { OBJECT_TO_STRING } from "./object";

/**
 * Returns true. if "subject" parameter is a thenable Object or Promise.
 *
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function promise(subject) {
  switch (OBJECT_TO_STRING.call(subject)) {
  case OBJECT_SIGNATURE:
    return subject !== null && typeof subject.then === TYPE_FUNCTION;

  case PROMISE_SIGNATURE:
    return true;
  }

  return false;
}
