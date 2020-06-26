import { TYPE_SYMBOL } from "./constants";

/**
 * Returns true. if "subject" parameter is Symbol.
 *
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function symbol(subject) {
  return typeof subject === TYPE_SYMBOL;
}
