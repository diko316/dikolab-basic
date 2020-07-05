import {
  TYPE_NUMBER,
  TYPE_FUNCTION,
  TYPE_OBJECT,
  TYPE_STRING,
  EMPTY_STRING
} from "../native/constants";

import { OBJECT_KEYS } from "../native/object";

import { ARRAY_SLICE } from "../native/array";

import { IS_FINITE } from "../native/number";

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
 * @param {object|string|Array} subject object or iteratable to iterate.
 * @param {eachObjectPropertyCallback} callback function to call on each iteration.
 * @returns {number|string|false} last iteratable index or property name iterated.
 *                                Or, false if iteration is not successfull.
 */
export function each(subject, callback) {
  let iteratable = subject;
  let c = 0;
  let properties = null;
  let key;
  let length;

  if (typeof callback !== TYPE_FUNCTION || subject === null) {
    return false;
  }

  switch (typeof iteratable) {
  case TYPE_STRING:
    iteratable = ARRAY_SLICE.call(iteratable, 0);

  // falls through
  case TYPE_FUNCTION:
  case TYPE_OBJECT:
    length = iteratable.length;

    // iterate indexes if iteratable
    if (typeof length === TYPE_NUMBER && IS_FINITE(length) && length > -1) {
      for (; length--; c++) {
        if (callback(subject[c], c) === false) {
          return c;
        }
      }

      return -1;
    }
    // try iterate through keys
    else {
      properties = OBJECT_KEYS(subject);
      length = properties.length;
      for (; length--; c++) {
        key = properties[c];
        if (callback(subject[key], key) === false) {
          return key;
        }
      }

      return EMPTY_STRING;
    }
  }

  return false;
}
