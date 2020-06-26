import { FUNCTION_SIGNATURE } from "./constants";

import { OBJECT_TO_STRING } from "./object";

/**
 * Returns true. if "subject" parameter is a Function.
 *
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function method(subject) {
  return OBJECT_TO_STRING.call(subject) === FUNCTION_SIGNATURE;
}
