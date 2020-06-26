import { DATE_SIGNATURE } from "./constants";
import { OBJECT_TO_STRING } from "./object";

/**
 * Returns true. if "subject" parameter is an instance of Date.
 *
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function date(subject) {
  return OBJECT_TO_STRING.call(subject) === DATE_SIGNATURE;
}
