import { TYPE_BIGINT } from "./constants";

/**
 * Returns true. if "subject" parameter is BigInt.
 *
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function bigint(subject) {
  return typeof subject === TYPE_BIGINT;
}
