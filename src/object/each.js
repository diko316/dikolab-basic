import {
  OBJECT_SIGNATURE,
  ARRAY_SIGNATURE,
  TYPE_NUMBER,
  TYPE_FUNCTION
} from "../native/constants";

import {
  OBJECT_KEYS,
  OBJECT_TO_STRING
} from "../native/object";

import {
  EACH_ERROR_INVALID_CALLBACK,
  EACH_ERROR_INVALID_SUBJECT
} from "./constants";

/**
 * Used for each(subject, callback) callback parameter.
 *
 * @typedef {function} eachObjectPropertyCallback
 * @param {*} item value of item with given object key or iteratable index
 * @param {string|number} index key of object or index of iteratable
 * @returns {boolean|undefined} optionally, return false to stop iteration.
 */

/**
 * Iterates object properties or iteratable items calling [callback].
 *
 * @param {object|Array} subject object or iteratable to iterate.
 * @param {eachObjectPropertyCallback} callback function to call on each iteration.
 * @returns {number|string} last iteratable index or property name iterated.
 */
export function each(subject, callback) {
  let c = 0;
  let length = 0;
  let key = null;
  let properties = null;

  if (typeof callback !== TYPE_FUNCTION) {
    throw new Error(EACH_ERROR_INVALID_CALLBACK);
  }

  switch (OBJECT_TO_STRING.call(subject)) {
  case OBJECT_SIGNATURE:
    length = subject.length;
    // iterate object
    if (typeof length !== TYPE_NUMBER || length < 0 || !isFinite(length)) {
      properties = OBJECT_KEYS(subject);

      for (; length--; c++) {
        key = properties[c];
        if (callback(subject[key], key) === false) {
          return key;
        }
      }
    }
    // at this point object is iteratable

  // falls through
  case ARRAY_SIGNATURE:
    length = subject.length;
    for (; length--; c++) {
      if (callback(subject[c], c) === false) {
        return c;
      }
    }

    break;

  default:
    throw new Error(EACH_ERROR_INVALID_SUBJECT);
  }
}
