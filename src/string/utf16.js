import { isString } from "../object/type";
import {
  ARRAY_SLICE,
  ARRAY_PUSH,
  ARRAY_JOIN
} from "../array/native-method";

import { eachU16Chars } from "./utf16-helper";

export class Utf16 {
  constructor(subject) {
    const isTypeUtf16 = subject instanceof Utf16;
    let length = 0;

    if (!isString(subject) && !isTypeUtf16) {
      throw new TypeError(`subject parameter is not string: ${subject}`);
    }

    // clone instance
    if (isTypeUtf16) {
      length = subject.length;
      ARRAY_PUSH.apply(this, subject);

    }
    else {
      length = eachU16Chars(
        subject,
        (point, char, index) => {
          this[index] = char;
        }
      );
    }

    Object.defineProperty(
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

  slice(begin, end) {
    return new Utf16(
      ARRAY_SLICE.call(this, begin, end).join("")
    );
  }

  concat(subject) {
    const isUtf16 = subject instanceof Utf16;

    if (!isUtf16 && !isString(subject)) {
      return this.clone();
    }

    return new Utf16(
      this.toString() + (isUtf16 ? subject.toString() : subject)
    );
  }

  clone() {
    return new Utf16(this);
  }

  toPoints() {
    const list = [];

    eachU16Chars(
      this.toString(),
      (point, char, index) => {
        list[index] = point;
      }
    );

    return list;
  }

  toArray() {
    return ARRAY_SLICE.call(this, 0);
  }

  toString() {
    return ARRAY_JOIN.call(this, "");
  }
}
