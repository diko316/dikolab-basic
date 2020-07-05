import { OBJECT_HAS_OWN } from "../native/object";

import {
  TYPE_OBJECT,
  TYPE_FUNCTION
} from "../native/constants";

import { stringifyScalar } from "../string/stringify-scalar";

/**
 * Returns true. if "subject" object contains property.
 *
 * @param {object} subject object to inspect.
 * @param {string} property property name to inspect
 * @returns {boolean} true if "subject" contains property. false otherwise.
 */
export function contains(subject, property) {
  const find = stringifyScalar(property);

  if (subject === null || !find) {
    return false;
  }

  switch (typeof subject) {
  case TYPE_OBJECT:
  case TYPE_FUNCTION:
    return OBJECT_HAS_OWN.call(subject, find);
  }

  return false;
}
