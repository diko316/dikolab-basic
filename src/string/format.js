import {
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_BOOLEAN,
  TYPE_SYMBOL,

  BOOLEAN_TRUE,
  BOOLEAN_FALSE,
  EMPTY_STRING
} from "../native";

import { numberify } from "../number/format";

import {
  STRING_TRIM_LEFT_REGEXP,
  STRING_TRIM_RIGHT_REGEXP,
  TRIM_ERROR_NOT_STRING
} from "./constants";

/**
 * Convert Any value to string. Or return "defaultValue" parameter.
 *
 * @function module:string.stringify
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
  case TYPE_SYMBOL: return String(subject);
  }

  return defaultValue;
}

/**
 * Returns repeated string "subject" in "count" number of times.
 *
 * @function module:string.repeat
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
 * @function module:string.trim
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
 * @function module:string.trimStart
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
 * @function module:string.trimEnd
 * @param {string} subject The string to trim.
 * @returns {string} Whitespace trimmed string.
 */
export function trimEnd(subject) {
  if (typeof subject !== TYPE_STRING) {
    throw new TypeError(TRIM_ERROR_NOT_STRING);
  }

  return subject && subject.replace(STRING_TRIM_RIGHT_REGEXP, EMPTY_STRING);
}
