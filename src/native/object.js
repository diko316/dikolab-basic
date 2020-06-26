import { OBJECT_SIGNATURE } from "./constants";

const OBJECT = Object;

const ObjectPrototype = OBJECT.prototype;

export const OBJECT_DEFINE_PROPERTY = OBJECT.defineProperty;

export const OBJECT_TO_STRING = ObjectPrototype.toString;

export const OBJECT_HAS_OWN = ObjectPrototype.hasOwnProperty;

export const OBJECT_KEYS = OBJECT.keys;

/**
 * Returns true. if "subject" parameter is an instance of User defined Object.
 *
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function object(subject) {
  return subject !== null && OBJECT_TO_STRING.call(subject) === OBJECT_SIGNATURE;
}
