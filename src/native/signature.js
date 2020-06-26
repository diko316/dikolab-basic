import {
  TYPE_UNDEFINED,
  TYPE_FUNCTION,
  UNDEFINED_SIGNATURE,
  NULL_SIGNATURE,
  PROMISE_SIGNATURE
} from "./constants";

import { OBJECT_TO_STRING } from "./object";

/**
 * Returns Object signature of "subject" parameter.
 * The Object signature in `[object ${ObjectName}]` syntax.
 * The value is extracted by using the value from Object.prototype.toString.call(subject) call.
 *
 * @param {*} subject value to test
 * @returns {string} resolved Object signature `[object ${ObjectName}]`
 */
export function signature(subject) {
  if (typeof subject === TYPE_UNDEFINED) {
    return UNDEFINED_SIGNATURE;
  }

  if (subject === null) {
    return NULL_SIGNATURE;
  }

  if (subject && typeof subject.then === TYPE_FUNCTION) {
    return PROMISE_SIGNATURE;
  }

  return OBJECT_TO_STRING.call(subject);
}
