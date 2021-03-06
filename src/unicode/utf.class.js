import {
  TYPE_NUMBER,
  TYPE_UNDEFINED,
  TYPE_FUNCTION,
  EMPTY_STRING,
  NOT_NUMBER,
  TYPE_STRING
} from "../native/constants";

import { OBJECT_DEFINE_PROPERTY } from "../native/object";

import {
  IS_FINITE
} from "../native/number";

import {
  MATH_MAX,
  MATH_MIN,
  MATH_FLOOR
} from "../native/math";

import {
  ARRAY_PUSH,
  ARRAY_SLICE
} from "../native/array";

import {
  REGEXP,
  regexp
} from "../native/regexp";

import { listPadStart } from "../array/list-pad-start";
import { listPadEnd } from "../array/list-pad-end";

import {
  STRING_TRIM_REGEXP,
  STRING_TRIM_LEFT_REGEXP,
  STRING_TRIM_RIGHT_REGEXP,
  DEFAULT_PADSTRING
} from "../string/constants";

import { stringify } from "../string/stringify";

import {
  INVALID_REPEAT_COUNT_ERROR
} from "./constants";

import { eachUnicode } from "./each-unicode";

import { stringToCodePoints } from "./string-to-code-points";

import { stringToUnicodes } from "./string-to-unicodes";

/**
 * String.prototype.replace() callback.
 *
 * @typedef {function} stringReplaceCallback
 * @param {string} matched string matched by replace() pattern.
 * @param {...string} captures string match captures in pattern.
 * @param {number} offset the zero-based index position of the current match.
 * @param {string} subject the string calling replace(pattern, callback).
 */

/**
 * Utf Class for unicode representation of String.
 */
export class Utf {
  /**
   * Creates Utf instance based from string or Utf16 (cloning).
   *
   * @param {string|Utf} subject The string to create from.
   */
  constructor(subject) {
    const empty = EMPTY_STRING;
    const defineProperty = OBJECT_DEFINE_PROPERTY;
    let points = [];
    let text = null;
    let length = 0;

    // create clone
    if (subject instanceof Utf) {
      text = subject.text;
      length = subject.length;

      if (text !== empty) {
        ARRAY_PUSH.apply(this, subject);
        points = subject.points.slice(0);
      }
    }
    else {
      text = stringify(subject);
      length = eachUnicode(
        subject,
        (codePoint, char, index) => {
          this[index] = char;
          points[index] = codePoint;
        }
      );
    }

    /**
     * @property {number} length
     */
    defineProperty(
      this,
      "length",
      {
        writable: false,
        enumerable: false,
        configurable: true,
        value: length
      }
    );

    /**
     * @property {number[]} points
     */
    defineProperty(
      this,
      "points",
      {
        writable: false,
        enumerable: false,
        configurable: true,
        value: points
      }
    );

    /**
     * @property {string} text
     */
    defineProperty(
      this,
      "text",
      {
        writable: false,
        enumerable: false,
        configurable: true,
        value: text
      }
    );
  }

  /**
   * Extracts Unicode code point at givent [index] position.
   *
   * @param {number} index The character position to extract Unicode code point.
   * @returns {number} The extracted Unicode code point.
   */
  codePointAt(index) {
    if (typeof index === TYPE_NUMBER && index > -1 && index < this.length) {
      return this.points[index];
    }

    return NOT_NUMBER;
  }

  /**
   * Extracts string at given [index] position.
   * Please note that length of string is possibly greater than 1 characters.
   *
   * @param {number} index The character position to extract.
   * @returns {string} The extracted string
   */
  charAt(index) {
    if (typeof index === TYPE_NUMBER && index > -1 && index < this.length) {
      return this[index];
    }

    return EMPTY_STRING;
  }

  /**
   * Creates new Utf instance with only extracted section of the string.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice}
   * @param {*} begin The zero-based index at which to begin extraction. If negative, it is treated as str.length + beginIndex.
   * @param {*} end The zero-based index before which to end extraction. The character at this index will not be included.
   * @returns {Utf} Utf instance with containing extracted string.
   */
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
      return new Utf(empty);
    }

    return new Utf(
      ARRAY_SLICE.call(this, start, limit).join(empty)
    );
  }

  /**
   * Creates Utf instance containing part of string between [begin] and [end].
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring}
   * @param {number} begin The index of the first Unicode character to include in the returned substring.
   * @param {number} [end] The index of the first Unicode character to exclude from the returned substring.
   * @returns {Utf} Utf instance containing extracted string.
   */
  substring(begin, end = undefined) {
    const min = MATH_MIN;
    const max = MATH_MAX;
    const empty = EMPTY_STRING;
    const length = this.length;

    let start = min(max(begin, 0) || 0, length);
    let limit = typeof end === TYPE_UNDEFINED ? length : min(max(end, 0) || 0, length);

    if (start === limit) {
      return new Utf(empty);
    }

    // swap
    if (start > limit) {
      start -= limit;
      limit += start;
      start = limit - start;
    }

    return new Utf(
      ARRAY_SLICE.call(this, start, limit).join(empty)
    );
  }

  /**
   * Creates Utf instance by concatenating Utf instances or strings.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat}
   * @param {...(string|Utf)} subject strings or Ut16 instances to concatentate.
   * @returns {Utf} Utf instance containing concatenated strings and Utf16s
   */
  concat(...subject) {
    const toString = stringify;
    const Me = Utf;
    const empty = EMPTY_STRING;
    const strings = [];
    let c = 0;

    for (let length = subject.length; length--; c++) {
      const value = subject[c];

      strings[c] = value instanceof Me ? value.text : toString(value);
    }

    return new Me(
      c ? strings.join(empty) : empty
    );
  }

  /**
   * Retrieves zero-based index position that first matches the FIRST occurence
   * of [searchValue] in Utf instance starting from zero or [fromIndex] if specified.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf}
   * @param {string|Utf} searchValue The string or Utf instance to search.
   * @param {number} [fromIndex=0] The index to start the search.
   * @returns {number} Returns the zero-based index. Or, -1 if not found.
   */
  indexOf(searchValue, fromIndex = 0) {
    const subject = this.points;
    const searchPoints = searchValue instanceof Utf ? searchValue.points
      : stringToCodePoints(
        stringify(searchValue, EMPTY_STRING)
      );
    const searchLength = searchPoints.length;
    const subjectLength = subject.length;
    let anchor = fromIndex;
    let length = subjectLength;
    let slength = 0;

    if (!subjectLength ||
      searchLength > subjectLength ||
      typeof anchor !== TYPE_NUMBER ||
      !IS_FINITE(anchor)
    ) {
      return -1;
    }

    // empty string rules from MDN
    if (!searchLength) {
      return MATH_MAX(0, MATH_MIN(anchor, subjectLength));
    }
    // more than length
    else if (anchor >= subjectLength) {
      return -1;
    }
    // finalize iteration anchor
    else if (anchor < 0) {
      anchor = 0;
    }
    else if (anchor > 0) {
      length = subjectLength - anchor;
    }

    /* eslint no-labels: 0 */
    mainLoop: for (; length--; anchor++) {
      if (anchor + searchLength - 1 > subjectLength) {
        return -1;
      }

      slength = searchLength;
      for (; slength--;) {
        if (searchPoints[slength] !== subject[anchor + slength]) {
          continue mainLoop;
        }
      }

      // found!
      return anchor;
    }

    return -1;
  }

  /**
   * Retrieves zero-based index position that first matches the LAST occurence
   * of [searchValue] in Utf instance starting from zero or [fromIndex] if specified.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf}
   * @param {string|Utf} searchValue The string or Utf instance to search.
   * @param {number} [fromIndex] The index to start the search.
   * @returns {number} Returns the zero-based index. Or, -1 if not found.
   */
  lastIndexOf(searchValue, fromIndex = null) {
    const min = MATH_MIN;
    const subject = this.points;
    const searchPoints = searchValue instanceof Utf ? searchValue.points
      : stringToCodePoints(
        stringify(searchValue, EMPTY_STRING)
      );
    const searchLength = searchPoints.length;
    const subjectLength = subject.length;
    let anchor = fromIndex === null ? subjectLength : fromIndex;
    let length = 0;

    if (!subjectLength ||
      searchLength > subjectLength ||
      typeof anchor !== TYPE_NUMBER ||
      !IS_FINITE(anchor)
    ) {
      return -1;
    }

    anchor = MATH_MAX(0, min(anchor, subjectLength));
    if (!searchLength) {
      return anchor;
    }

    anchor = min(anchor, subjectLength - searchLength);
    if (anchor < 0) {
      return -1;
    }

    /* eslint no-labels: 0 */
    mainLoop: for (; anchor + 1; anchor--) {
      length = searchLength;
      for (; length--;) {
        if (searchPoints[length] !== subject[anchor + length]) {
          continue mainLoop;
        }
      }
      return anchor;
    }

    return -1;
  }

  /**
   * Searches the Utf string with given RegExp [pattern] and
   * returns the zero-based index position of the first occurence.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search}
   * @param {RegExp} pattern The RegExp pattern to match.
   * @returns {number} Returns zero-based index if found. Returns -1 otherwise.
   */
  search(pattern) {
    const matches = this.text.match(REGEXP(pattern));

    // correct the index
    if (!matches) {
      return -1;
    }

    return this.indexOf(matches[0]);
  }

  /**
   * Determines if Utf or string [keyword] is found in this instance.
   *
   * @see {@link http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode}
   * @param {string|Utf} keyword The search keyword to match.
   * @param {number} position The zero-based index position to start the search.
   * @returns {boolean} Returns true if match is found. Returns false otherwise.
   */
  includes(keyword, position) {
    return this.indexOf(keyword, position) !== -1;
  }

  /**
   * The method returns a number indicating whether a reference string comes before or after
   * or is the same as the given string in sort order.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare}
   * @param {string|Utf} compareString The string or Utf16 against which the referring Utf is compared.
   * @param {string} [locales] A string with a BCP 47 language tag, or an array of such strings.
   * @param {object} [options] An object with some or all of the following properties:
   * @param {string} [options.localeMatcher="best fit"] Possible values: "lookup" or "best fit"
   * @param {string} [options.usage="sort"] Possible values: "sort" and "search"
   * @param {string} [options.sensitivity="variant"] Possible values: "variant", "case", "accent", and "base"
   * @param {boolean} [options.ignorePunctuation=false] Should ignore punctation or not.
   * @param {boolean} [options.numeric=false] Whether numeric collation should be used, such that "1" < "2" < "10".
   * @param {string} [options.caseFirst="false"] Whether upper case or lower case should sort first.
   *                    Possible values are "upper", "lower", or "false" (use the locale's default).
   * @returns {number} Returns negative number if Utf occurs before [compareString].
   *                    Returns positive number if Utf occurs after [compareString].
   *                    Returns zero (0) if equivalent.
   */
  localeCompare(compareString, locales, options) {
    const subject = compareString instanceof Utf ? compareString.text : compareString;
    const length = arguments.length;
    const string = this.text;

    return length < 2 ? string.localeCompare(subject)
      : length < 3 ? string.localeCompare(subject, locales)
        : string.localeCompare(subject, locales, options);
  }

  /**
   * Retrieves the result of matching a string against a regular expression.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match}
   * @param {RegExp} pattern A regular expression object.
   * @returns {Utf[]|null} Returns Array of Utf matches. Or, null of not matches.
   */
  match(pattern) {
    const Me = Utf;
    const found = this.text.match(pattern);
    let c = 0;
    let length = 0;

    if (found) {
      for (; length--; c++) {
        found[c] = new Me(found[c]);
      }
    }

    return found;
  }

  /**
   * Creates a padded Utf instance with another string (multiple times, if needed)
   * until the resulting string reaches the given length.
   * The padding is applied from the start of the current Utf instance.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart}
   * @param {number} targetLength The length of the resulting Utf instance once it has been padded.
   * @param {string|Utf} padString The string to pad the current Utf instance with.
   * @returns {Utf} Utf instance of the specified length with the pad string applied from the start.
   */
  padStart(targetLength, padString = DEFAULT_PADSTRING) {
    const empty = EMPTY_STRING;
    const pad = padString instanceof Utf ? padString
      : stringToUnicodes(
        stringify(padString, empty)
      );
    const result = listPadStart(this, targetLength, pad);

    return new Utf(
      result.join(empty)
    );
  }

  /**
   * Creates a padded Utf instance with another string (multiple times, if needed)
   * until the resulting string reaches the given length.
   * The padding is applied from the end of the Utf instance.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd}
   * @param {number} targetLength The length of the resulting Utf instance once it has been padded.
   * @param {string|Utf} padString The string to pad the current Utf instance with.
   * @returns {Utf} Utf instance of the specified length with the pad string applied from the start.
   */
  padEnd(targetLength, padString = DEFAULT_PADSTRING) {
    const empty = EMPTY_STRING;
    const pad = padString instanceof Utf ? padString
      : stringToUnicodes(
        stringify(padString, empty)
      );
    const result = listPadEnd(this, targetLength, pad);

    return new Utf(
      result.join(empty)
    );
  }

  /**
   * Creates Utf instance with repeated unicode text.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat}
   * @param {number} count Number of repeats.
   * @returns {Utf} Returns instance with repeated text.
   */
  repeat(count) {
    const string = this.text;
    let result = null;
    let c = 0;
    let length = 0;

    if (typeof count !== TYPE_NUMBER || !IS_FINITE(count) || count < 0) {
      throw new RangeError(INVALID_REPEAT_COUNT_ERROR);
    }

    length = MATH_FLOOR(count);
    result = [];
    for (; length--; c++) {
      result[c] = string;
    }

    return new Utf(
      result.join(EMPTY_STRING)
    );
  }

  /**
   * Safely splits unicode characters into list of Utf instances using a [separator] pattern.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split}
   * @param {string|RegExp|Utf} separator Separator pattern used for splitting.
   * @param {number} [limit] Limit number of splits.
   * @returns {Utf[]} Collection of Utf instances.
   */
  split(separator, limit) {
    const Me = Utf;
    const me = this;
    const empty = EMPTY_STRING;
    const subjectLength = me.length;
    const isRegex = regexp(separator);
    const isUtfInstance = separator instanceof Me;
    let limiter = typeof limit === TYPE_NUMBER && IS_FINITE(limit) && limit > -1
      ? limit
      : limit === null
        ? 0
        : undefined;
    let stringSeparator = isUtfInstance
      ? separator.text
      : isRegex || typeof separator === TYPE_STRING
        ? separator
        : stringify(separator);
    // safely return split version
    let result = null;
    let resultLength = 0;
    let buffer = null;
    let bufferLength = 0;
    let separatorLength = 0;
    let slength = 0;
    let c = 0;
    let length = 0;
    let matchPointer = 0;
    let isLast = false;
    let pos = null;

    // usual split
    if (isRegex || stringSeparator === empty) {
      result = isRegex
        ? me.text.split(stringSeparator, limiter)
        : ARRAY_SLICE.call(
          me,
          0,
          limiter
        );
      length = result.length;
      // replace
      for (; length--; c++) {
        result[c] = new Me(result[c]);
      }
      return result;
    }

    // manual split
    length = subjectLength;

    stringSeparator = isUtfInstance ? separator : stringToUnicodes(separator);
    separatorLength = stringSeparator.length;

    // replace
    buffer = [];
    result = [];
    if (typeof limiter === TYPE_UNDEFINED) {
      limiter = subjectLength;
    }
    mainLoop: for (; length--; c++) {
      isLast = length === 0;

      // check if separator matches
      slength = separatorLength;
      matchPointer = 0;

      for (; slength--; matchPointer++) {
        pos = c + matchPointer;
        // failed!
        if (pos >= subjectLength ||
          stringSeparator[matchPointer] !== me[pos]
        ) {
          buffer[bufferLength++] = me[c];
          if (!isLast) {
            continue mainLoop;
          }
        }
      }

      // generate result from buffer
      result[resultLength++] = new Me(
        bufferLength ? buffer.join(empty) : empty
      );

      // stop!
      if (resultLength === limiter) {
        break mainLoop;
      }
      // reset buffer
      else if (!isLast) {
        buffer = [];
        bufferLength = 0;
      }
    }

    return result;
  }

  /**
   * Creates new Utf instance with replacing unicode characters with [replacement] using [pattern].
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace}
   * @param {string|Utf|RegExp} pattern The pattern to match for replacement.
   * @param {string|Utf|stringReplaceCallback} replacement function callback or string replacement.
   * @returns {Utf} Utf instance with replaced unicode characters.
   */
  replace(pattern, replacement) {
    const Me = Utf;

    return new Me(
      this.text.replace(
        pattern instanceof Me
          ? pattern.text
          : regexp(pattern)
            ? pattern
            : stringify(pattern),
        replacement instanceof Me
          ? replacement.text
          : typeof replacement === TYPE_FUNCTION
            ? replacement
            : stringify(replacement)
      )
    );
  }

  /**
   * Removes whitespace characters prefix and suffix.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim}
   * @returns {Utf} new Utf instance with whitespaces removed.
   */
  trim() {
    return new Utf(
      this.text.replace(STRING_TRIM_REGEXP, EMPTY_STRING)
    );
  }

  /**
   * Removes whitespace characters prefix.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart}
   * @returns {Utf} new Utf instance with whitespaces removed.
   */
  trimStart() {
    return new Utf(
      this.text.replace(STRING_TRIM_LEFT_REGEXP, EMPTY_STRING)
    );
  }

  /**
   * Removes whitespace characters suffix.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd}
   * @returns {Utf} new Utf instance with whitespaces removed.
   */
  trimEnd() {
    return new Utf(
      this.text.replace(STRING_TRIM_RIGHT_REGEXP, EMPTY_STRING)
    );
  }

  /**
   * Clones Utf instance.
   *
   * @returns {Utf} cloned Utf instance.
   */
  clone() {
    return new Utf(this);
  }

  /**
   * Generates list of Utf code points.
   *
   * @returns {number[]} List of Unicode code points.
   */
  toPoints() {
    return this.points.slice(0);
  }

  /**
   * Creates Utf instance with string converted to upper-case.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase}
   * @returns {Utf} Utf instance with upper-case string.
   */
  toUpperCase() {
    return new Utf(
      this.text.toUpperCase()
    );
  }

  /**
   * Creates Utf instance with string converted to upper-case according to any locale-specific case mappings.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase}
   * @param {string|string[]} [locale] The locale/s to be used to convert to upper case according to any locale-specific case mappings.
   * @returns {Utf} Utf Instance with upper-case string.
   */
  toLocaleUpperCase(locale) {
    return new Utf(
      this.text.toLocaleUpperCase(locale)
    );
  }

  /**
   * Creates Utf instance with string converted to lower-case.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase}
   * @returns {Utf} Utf instance with lower-case string.
   */
  toLowerCase() {
    return new Utf(
      this.text.toLowerCase()
    );
  }

  /**
   * Creates Utf instance with string converted to lower-case according to any locale-specific case mappings.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase}
   * @param {string|string[]} [locale] The locale/s to be used to convert to upper case according to any locale-specific case mappings.
   * @returns {Utf} Utf instance with lower-case string.
   */
  toLocaleLowerCase(locale) {
    return new Utf(
      this.text.toLocaleLowerCase(locale)
    );
  }

  /**
   * Returns the JSON representation.
   *
   * @returns {string} JSON representation of Utf instance.
   */
  toJSON() {
    return this.text;
  }

  /**
   * Returns the Array representation of Utf instance.
   *
   * @returns {string[]} Array representation.
   */
  toArray() {
    return ARRAY_SLICE.call(this, 0);
  }

  /**
   * Returns the String representation of Uft instance.
   *
   * @returns {string} String representation of Utf intance.
   */
  toString() {
    return this.text;
  }

  /**
   * Returns the primitive value of this instance which is a string.
   *
   * @returns {string} String primitive value.
   */
  valueOf() {
    return this.text;
  }
}

export const EMPTY_UNICODE = new Utf(EMPTY_STRING);
