import { object } from "../native/type";

import { OBJECT_HAS_OWN } from "../native/object";

/**
 * Returns true. if "subject" object contains property.
 *
 * @function module:object.contains
 * @param {object} subject object to inspect.
 * @param {string} property property name to inspect
 * @returns {boolean} true if "subject" contains property. false otherwise.
 */
export function contains(subject, property) {
  return object(subject) && OBJECT_HAS_OWN.call(subject, property);
}
