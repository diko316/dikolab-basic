import { TYPE_NUMBER } from "./constants";

export const IS_FINITE = isFinite;

/**
 * Returns true. if "subject" parameter is Number.
 *
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function number(subject) {
  return typeof subject === TYPE_NUMBER && IS_FINITE(subject);
}
