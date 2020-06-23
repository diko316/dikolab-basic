import {
  TYPE_STRING,
  EMPTY_STRING
} from "../native/constants";

import { numberify } from "../number/format";

import {
  STRING_TRIM_LEFT_REGEXP,
  STRING_TRIM_RIGHT_REGEXP,
  TRIM_ERROR_NOT_STRING,
  ESCAPED_SINGLE_QUOTE,
  SINGLE_QUOTE,
  ESCAPED_DOUBLE_QUOTE,
  DOUBLE_QUOTE_ESCAPE,
  DOUBLE_QUOTE,
  DOUBLE_QUOTE_ESCAPE_ERROR,
  DEFAULT_PADSTRING
} from "./constants";

import {
  stringify
} from "./type";

import {
  listPadStart,
  listPadEnd
} from "../array/service";

/**
 * Returns repeated string "subject" in "count" number of times.
 *
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
 * Creates a padded string with another string (multiple times, if needed)
 * until the resulting string reaches the given length.
 * The padding is applied from the start of the string.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart}
 * @param {string} subject The string to pad.
 * @param {number} length The length of the resulting string once it has been padded.
 * @param {string} padString The string to pad the current string with.
 * @returns {string} string of the specified length with the pad string applied from the start.
 */
export function padStart(subject, length = 0, padString = DEFAULT_PADSTRING) {
  return listPadStart(
    stringify(subject),
    length,
    padString
  ).join(EMPTY_STRING);
}

/**
 * Creates a padded string with another string (multiple times, if needed)
 * until the resulting string reaches the given length.
 * The padding is applied from the end of the string.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd}
 * @param {string} subject The string to pad.
 * @param {number} length The length of the resulting stringe once it has been padded.
 * @param {string} padString The string to pad the current string with.
 * @returns {string} string of the specified length with the pad string applied from the end.
 */
export function padEnd(subject, length = 0, padString = DEFAULT_PADSTRING) {
  return listPadEnd(
    stringify(subject),
    length,
    padString
  ).join(EMPTY_STRING);
}

/**
 * Removes starting and ending white spaces.
 *
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
 * @param {string} subject The string to trim.
 * @returns {string} Whitespace trimmed string.
 */
export function trimEnd(subject) {
  if (typeof subject !== TYPE_STRING) {
    throw new TypeError(TRIM_ERROR_NOT_STRING);
  }

  return subject && subject.replace(STRING_TRIM_RIGHT_REGEXP, EMPTY_STRING);
}

function quoteReplace(all) {
  switch (all) {
  case ESCAPED_SINGLE_QUOTE: return SINGLE_QUOTE;
  case DOUBLE_QUOTE: return ESCAPED_DOUBLE_QUOTE;
  }
  return all;
}
export function quoteEscapify(subject) {
  if (typeof subject !== TYPE_STRING) {
    throw new TypeError(DOUBLE_QUOTE_ESCAPE_ERROR);
  }

  return subject && subject.replace(DOUBLE_QUOTE_ESCAPE, quoteReplace);
}
