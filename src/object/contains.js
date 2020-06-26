import {
  OBJECT_HAS_OWN,
  object
} from "../native/object";

/**
 * Returns true. if "subject" object contains property.
 *
 * @param {object} subject object to inspect.
 * @param {string} property property name to inspect
 * @returns {boolean} true if "subject" contains property. false otherwise.
 */
export function contains(subject, property) {
  return object(subject) && OBJECT_HAS_OWN.call(subject, property);
}
