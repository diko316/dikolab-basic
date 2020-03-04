import {
  TYPE_OBJECT,
  TYPE_NUMBER,
  STRING_FROM_CHARCODE,
  EMPTY_FUNCTION,
  EMPTY_STRING,
  isArray,
  isString
} from "../native";

export function eachU16(subject, callback) {
  const empty = EMPTY_STRING;
  const fromCharCode = STRING_FROM_CHARCODE;
  const lengthProperty = subject && typeof subject === TYPE_OBJECT;
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

export function fromCodePoint(codes) {
  const finite = isFinite;
  const empty = EMPTY_STRING;
  const fromCharCode = STRING_FROM_CHARCODE;
  let result = empty;

  if (!isArray(codes)) {
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

export function toCodePoints(subject, target) {
  let result = target;

  if (!isString(subject)) {
    return result;
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

export function toUtfChars(subject, target) {
  let result = target;

  if (!isString(subject)) {
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

export function utfCount(subject) {
  return eachU16(subject, EMPTY_FUNCTION);
}
