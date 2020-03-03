import {
  isArray,
  isString
} from "../object/type";

import { STRING_FROM_CHARCODE } from "./native-method";

export function eachU16Chars(subject, callback) {
  const fromCharCode = STRING_FROM_CHARCODE;
  let index = 0;

  for (let c = 0, length = subject.length; length--; c++) {
    let first = 0;
    let second = 0;

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
    callback(
      (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000,
      fromCharCode(first) + fromCharCode(second),
      index++
    );
  }

  return index;
}


export function points2string(codes) {
  const number = isFinite;
  const fromCharCode = STRING_FROM_CHARCODE;
  let result = "";

  if (!isArray(codes)) {
    return result;
  }

  result = [];

  for (let c = 0, length = codes.length; length--; c++) {
    const code = codes[c];
    let value = 1 * code;

    if (!number(value) || value < 0 || value > 0x10FFFF) {
      console.warn(RangeError(`Invalid code point: ${code}`));
      return "";
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

  return result.join("");
}

export function string2points(subject, target) {
  let result = target;

  if (!isString(subject)) {
    return result;
  }

  if (!result || typeof result !== "object") {
    result = [];
  }

  result.length = eachU16Chars(
    subject,
    function (point, char, index) {
      result[index] = point;
    }
  );

  return result;
}

export function string2chars(subject, target) {
  let result = target;

  if (!isString(subject)) {
    return result;
  }

  if (!result || typeof result !== "object") {
    result = [];
  }

  result.length = eachU16Chars(
    subject,
    function (point, char, index) {
      result[index] = char;
    }
  );

  return result;
}
