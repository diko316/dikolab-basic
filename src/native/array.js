import { ARRAY_SIGNATURE } from "./constants";

import { OBJECT_TO_STRING } from "./object";

const ArrayPrototype = Array.prototype;

export const ARRAY_SLICE = ArrayPrototype.slice;

export const ARRAY_PUSH = ArrayPrototype.push;

export const ARRAY_SPLICE = ArrayPrototype.splice;

export const ARRAY_JOIN = ArrayPrototype.join;

/**
 * Returns true. if "subject" parameter is an Array.
 *
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function array(subject) {
  return OBJECT_TO_STRING.call(subject) === ARRAY_SIGNATURE;
}
