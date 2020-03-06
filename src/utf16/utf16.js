import {
  TYPE_OBJECT,
  TYPE_NUMBER,
  TYPE_STRING,
  STRING_FROM_CHARCODE,
  EMPTY_FUNCTION,
  EMPTY_STRING,
  array,
  string
} from "../native";

/**
 * The callback used to on each Utf-16 codePoint found.
 *
 * @callback eachCodePointCallback
 * @param {number} codePoint Utf-16 codePoint
 * @param {string} chars string representation of codePoint
 */

/**
 * Iterates Utf-16 codePoints of string and execute callback on each codePoint found.
 *
 * @alias module:utf16.eachU16
 * @param {string} subject string to iterate.
 * @param {eachCodePointCallback} callback The callback to execute on each codePoint.
 * @returns {number} number of codePoints found
 */
export function eachU16(subject, callback) {
  const empty = EMPTY_STRING;
  const fromCharCode = STRING_FROM_CHARCODE;
  const type = typeof subject;
  const lengthProperty = subject !== null && (type === TYPE_OBJECT || type === TYPE_STRING) ? subject.length : null;
  let index = 0;

  if (typeof lengthProperty !== TYPE_NUMBER || !isFinite(lengthProperty) || lengthProperty < 0) {
    return 0;
  }

  for (let c = 0, length = subject.length; length--; c++) {
    let first = 0;
    let second = 0;
    let code = empty;

    first = subject.charCodeAt(c);
    if (first < 0xD800 || first > 0xDBFF || c === length) {
      callback(first, fromCharCode(first), index++);
      continue;
    }

    second = subject.charCodeAt(c + 1);
    if (second < 0xDC00 || second > 0xDFFF) { // not low surrogate
      callback(first, fromCharCode(first), index++);
      continue;
    }

    // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
    c++;
    length--;
    code = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    callback(
      code,
      fromCharCode(first) + fromCharCode(second),
      index++
    );
  }

  return index;
}

/**
 * Creates string with given list of codePoints.
 *
 * @alias module:utf16.fromCodePoint
 * @param {number[]} codes list of codePoints.
 * @returns {string} the string created based from codePoints list.
 */
export function fromCodePoint(codes) {
  const finite = isFinite;
  const empty = EMPTY_STRING;
  const fromCharCode = STRING_FROM_CHARCODE;
  let result = empty;

  if (!array(codes)) {
    return result;
  }

  result = [];

  for (let c = 0, length = codes.length; length--; c++) {
    const code = codes[c];
    let value = 1 * code;

    if (!finite(value) || value < 0 || value > 0x10FFFF) {
      console.warn(RangeError(`Invalid code point: ${code}`));
      return empty;
    }

    if (value > 0xFFFF) {
      value -= 0x10000;
      result[c] = fromCharCode(
        (value >> 10) + 0xD800,
        (value % 0x400) + 0xDC00
      );
    }
    else {
      result[c] = fromCharCode(value);
    }
  }

  return result.join(empty);
}

/**
 * Creates an Array of codePoints based from string "subject" parameter.
 *
 * @alias module:utf16.toCodePoints
 * @param {string} subject string to iterate.
 * @param {*} target iteratable object to populate.
 * @returns {number[]} list of codePoints.
 */
export function toCodePoints(subject, target) {
  let result = target;

  if (!string(subject)) {
    return [];
  }

  if (!result || typeof result !== TYPE_OBJECT) {
    result = [];
  }

  result.length = eachU16(
    subject,
    function (point, char, index) {
      result[index] = point;
    }
  );

  return result;
}

/**
 * Creates an array of [string] Utf-16 characters from string.
 *
 * @alias module:utf16.toUtfChars
 * @param {string} subject The string to generate Utf-16 characters list.
 * @param {*} target iteratable object to populate.
 * @returns {string[]} list of Utf-16 characters.
 */
export function toUtfChars(subject, target) {
  let result = target;

  if (!string(subject)) {
    return result;
  }

  if (!result || typeof result !== TYPE_OBJECT) {
    result = [];
  }

  result.length = eachU16(
    subject,
    function (point, char, index) {
      result[index] = char;
    }
  );

  return result;
}

/**
 * Returns the length of characters resolving Utf-16 codePoints.
 *
 * @alias module:utf16.utfCount
 * @param {string} subject string to count.
 * @returns {number} number of Utf-16 characters found.
 */
export function utfCount(subject) {
  if (!subject || !string(subject)) {
    return 0;
  }

  return eachU16(subject, EMPTY_FUNCTION);
}
