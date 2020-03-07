import {
  TYPE_STRING,
  TYPE_NUMBER,
  TYPE_UNDEFINED,
  ARRAY_SLICE,
  ARRAY_PUSH,
  OBJECT_DEFINE_PROPERTY,
  NOT_NUMBER,
  EMPTY_STRING,

  MATH_MAX,
  MATH_MIN,
  string
} from "../native";

import { eachU16 } from "./utf16";

export class Utf16 {
  constructor(subject) {
    let length = 0;
    let text = subject;

    // clone instance
    if (text instanceof Utf16) {
      length = text.length;
      text = text.text;
      ARRAY_PUSH.apply(this, subject);
    }
    else {
      // finalize string subject
      if (typeof text !== TYPE_STRING) {
        text = String(text);
      }

      // finalize length
      length = text === EMPTY_STRING ? 0 : eachU16(
        text,
        (point, char, index) => {
          this[index] = char;
        }
      );
    }

    OBJECT_DEFINE_PROPERTY(
      this,
      "text",
      {
        writable: false,
        enumerable: false,
        configurable: true,
        value: text
      }
    );

    OBJECT_DEFINE_PROPERTY(
      this,
      "length",
      {
        writable: false,
        enumerable: false,
        configurable: true,
        value: length
      }
    );
  }

  codePointAt(index) {
    let code = 0;

    if (typeof index === TYPE_NUMBER && index > -1 && index < this.length) {
      eachU16(
        this[index],
        (point, char, index) => {
          code = point;
        }
      );

      return code;
    }

    return NOT_NUMBER;
  }

  charAt(index) {
    if (typeof index === TYPE_NUMBER && index > -1 && index < this.length) {
      return this[index];
    }

    return EMPTY_STRING;
  }

  slice(begin, end) {
    const min = MATH_MIN;
    const max = MATH_MAX;
    const empty = EMPTY_STRING;
    const length = this.length;

    let start = min(begin, length) || 0;
    let limit = typeof end === TYPE_UNDEFINED ? length : min(end, length) || 0;

    if (start < 0) {
      start = max(length + start, 0);
    }

    if (limit < 0) {
      limit = max(length + limit, 0);
    }

    if (start >= limit) {
      return new Utf16(empty);
    }

    return new Utf16(
      ARRAY_SLICE.call(this, start, limit).join(empty)
    );
  }

  substring(begin, end = undefined) {
    const min = MATH_MIN;
    const max = MATH_MAX;
    const empty = EMPTY_STRING;
    const length = this.length;

    let start = min(max(begin, 0) || 0, length);
    let limit = typeof end === TYPE_UNDEFINED ? length : min(max(end, 0) || 0, length);

    if (start === limit) {
      return new Utf16(empty);
    }

    // swap
    if (start > limit) {
      start -= limit;
      limit += start;
      start = limit - start;
    }

    return new Utf16(
      ARRAY_SLICE.call(this, start, limit).join(empty)
    );
  }

  concat(subject) {
    const isUtf16 = subject instanceof Utf16;

    if (!isUtf16 && !string(subject)) {
      return this.clone();
    }

    return new Utf16(
      this.text + (isUtf16 ? subject.text : subject)
    );
  }

  clone() {
    return new Utf16(this);
  }

  toPoints() {
    const list = [];

    eachU16(
      this.toString(),
      (point, char, index) => {
        list[index] = point;
      }
    );

    return list;
  }

  toJson() {
    return this.text;
  }

  toArray() {
    return ARRAY_SLICE.call(this, 0);
  }

  toString() {
    return this.text;
  }
}
