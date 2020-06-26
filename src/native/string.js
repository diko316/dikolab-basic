import { TYPE_STRING } from "./constants";

export const STRING = String;

/**
 * Localized native String.fromCharCode(num1, [...numN]).
 * For more info, check out
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode MDN}
 * documentation
 *
 * @function
 * @constant
 * @protected
 * @param {number} num1 utf-8 character code
 * @param {...number} [numN] utf-8 character code
 * @returns {string}
 */
export const STRING_FROM_CHARCODE = STRING.fromCharCode;

/**
 * Returns true. if "subject" parameter is String.
 *
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function string(subject) {
  return typeof subject === TYPE_STRING;
}
