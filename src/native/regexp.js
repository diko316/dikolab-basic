import { REGEXP_SIGNATURE } from "./constants";
import { OBJECT_TO_STRING } from "./object";

export const REGEXP = RegExp;

/**
 * Returns true. if "subject" parameter is an instance of RegExp.
 *
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function regexp(subject) {
  return OBJECT_TO_STRING.call(subject) === REGEXP_SIGNATURE;
}
