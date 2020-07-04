import { TYPE_NUMBER } from "./constants";

export const IS_FINITE = isFinite;
export const MAX_NUMBER = Number.MAX_VALUE;
export const PARSE_INT = parseInt;
export const NUMERIC_REGEXP = /^[-+]?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?$/;

/**
 * Returns true. if "subject" parameter is Number.
 *
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function number(subject) {
  return typeof subject === TYPE_NUMBER && IS_FINITE(subject);
}
