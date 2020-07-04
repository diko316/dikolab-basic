import {
  TYPE_STRING,
  TYPE_NUMBER,
  TYPE_BIGINT,
  TYPE_BOOLEAN
} from "../native/constants";

import {
  IS_FINITE,
  PARSE_INT,
  NUMERIC_REGEXP
} from "../native/number";

/**
 * Convert any type "subject" parameter to number.
 *
 * @param {*} subject data to convert to number.
 * @param {*} [defaultValue=0] default return value.
 * @returns {number|*} Uses defaultValue if not converted to number.
 */
export function numberify(subject, defaultValue = 0) {
  const parse = PARSE_INT;
  const finite = IS_FINITE;
  const numericRegex = NUMERIC_REGEXP;
  const typeString = TYPE_STRING;
  const typeNumber = TYPE_NUMBER;
  const typeBigInt = TYPE_BIGINT;
  const typeBoolean = TYPE_BOOLEAN;

  switch (typeof subject) {
  case typeString:
    if (numericRegex.test(subject)) {
      return 1 * subject;
    }
    break;

  case typeBigInt:
    return parse(subject, 10);

  case typeNumber:
    if (finite(subject)) {
      return subject;
    }
    break;

  case typeBoolean:
    return subject ? 1 : 0;
  }

  switch (typeof defaultValue) {
  case typeString: return numericRegex.test(defaultValue) ? 1 * defaultValue : 0;
  case typeBigInt: return parse(defaultValue, 10);
  case typeNumber: return finite(defaultValue) ? defaultValue : 0;
  case typeBoolean: return defaultValue ? 1 : 0;
  }

  return 0;
}
