import {
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_BOOLEAN,
  TYPE_FUNCTION,

  BOOLEAN_TRUE,
  BOOLEAN_FALSE,
  EMPTY_STRING
} from "../native";

/**
 * Convert Any value to string. Or return "defaultValue" parameter.
 *
 * @alias module:string.stringify
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
  case TYPE_FUNCTION: return defaultValue;
  }

  return String(subject);
}
