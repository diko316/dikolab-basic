import {
  TYPE_STRING,
  TYPE_NUMBER,
  TYPE_BOOLEAN
} from "../native";

/**
 * Convert any type "subject" parameter to number.
 *
 * @function module:number.numberify
 * @param {*} subject data to convert to number.
 * @param {*} [defaultValue=0] default return value.
 * @returns {number|*} Uses defaultValue if not converted to number.
 */
export function numberify(subject, defaultValue = 0) {
  let value = subject;

  switch (typeof value) {
  case TYPE_STRING:
    value = 1 * value;

  // falls through
  case TYPE_NUMBER: return isFinite(value) ? value : defaultValue;

  case TYPE_BOOLEAN: return value ? 1 : 0;
  }

  return defaultValue;
}
