import { TYPE_BOOLEAN } from "./constants";

/**
 * Returns true. if "subject" parameter is Boolean.
 *
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function boolean(subject) {
  return typeof subject === TYPE_BOOLEAN;
}
