import {
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_BOOLEAN,
  TYPE_SYMBOL,

  BOOLEAN_TRUE,
  BOOLEAN_FALSE,
  EMPTY_STRING
} from "../native/constants";

import {
  MATH_RANDOM,
  MATH_ROUND
} from "../native/math";

import {
  STRING
} from "../native/string";

import { numberify } from "../number/format";

import {
  STRING_TRIM_LEFT_REGEXP,
  STRING_TRIM_RIGHT_REGEXP,
  TRIM_ERROR_NOT_STRING
} from "./constants";

/**
 * Convert Any value to string. Or return "defaultValue" parameter.
 *
 * @category String
 * @function module:basic.stringify
 * @param {*} subject data to convert to string.
 * @param {*} [defaultValue=""] fallback value to return if conversion fails.
 * @returns {string|*} returns defaultValue if unable to convert to string.
 */
export function stringify(subject, defaultValue = EMPTY_STRING) {
  const empty = EMPTY_STRING;

  switch (typeof subject) {
  case TYPE_BOOLEAN: return subject ? BOOLEAN_TRUE : BOOLEAN_FALSE;
  case TYPE_NUMBER:
    return isFinite(subject) ? empty + subject : defaultValue;

  case TYPE_STRING: return subject;
  case TYPE_SYMBOL:
    return [
      STRING(subject),
      "[",
      (new Date()).getTime().toString(16),
      MATH_ROUND(MATH_RANDOM() * 1000).toString(16),
      "]"
    ].join(empty);
  }

  return defaultValue;
}

/**
 * Returns repeated string "subject" in "count" number of times.
 *
 * @function module:basic.repeat
 * @param {string} subject any data convertible to string.
 * @param {number} count number of times to repeat.
 * @returns {string} Returns empty string if unable to repeat.
 */
export function repeat(subject, count) {
  const empty = EMPTY_STRING;
  const value = stringify(subject, empty);
  let length = numberify(count, 0);
  let list = null;

  if (!value || length < 1) {
    return value;
  }

  list = [];
  length++;

  for (let c = 0; length--; c++) {
    list[c] = value;
  }

  return list.join(empty);
}

/**
 * Removes starting and ending white spaces.
 *
 * @function module:basic.trim
 * @param {string} subject The string to trim.
 * @returns {string} Whitespace trimmed string.
 */
export function trim(subject) {
  const empty = EMPTY_STRING;

  if (typeof subject !== TYPE_STRING) {
    throw new TypeError(TRIM_ERROR_NOT_STRING);
  }

  return subject && subject
    .replace(STRING_TRIM_LEFT_REGEXP, empty)
    .replace(STRING_TRIM_RIGHT_REGEXP, empty);
}

/**
 * Removes starting white spaces.
 *
 * @function module:basic.trimStart
 * @param {string} subject The string to trim.
 * @returns {string} Whitespace trimmed string.
 */
export function trimStart(subject) {
  if (typeof subject !== TYPE_STRING) {
    throw new TypeError(TRIM_ERROR_NOT_STRING);
  }

  return subject && subject.replace(STRING_TRIM_LEFT_REGEXP, EMPTY_STRING);
}

/**
 * Removes ending whitespace.
 *
 * @function module:basic.trimEnd
 * @param {string} subject The string to trim.
 * @returns {string} Whitespace trimmed string.
 */
export function trimEnd(subject) {
  if (typeof subject !== TYPE_STRING) {
    throw new TypeError(TRIM_ERROR_NOT_STRING);
  }

  return subject && subject.replace(STRING_TRIM_RIGHT_REGEXP, EMPTY_STRING);
}
