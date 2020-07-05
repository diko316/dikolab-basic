import { OBJECT_SIGNATURE } from "../native/constants";

import {
  OBJECT_KEYS,
  OBJECT_TO_STRING
} from "../native/object";

/**
 * Assign own properties of [source] to [subject].
 *
 * @param {object} subject target object to populate with [source] properties.
 * @param {object} source source of properties to populate [subject].
 * @returns {object} the [subject] parameter.
 */
export function assign(subject, source) {
  const toSignature = OBJECT_TO_STRING;
  const objectSignature = OBJECT_SIGNATURE;
  let properties = null;
  let c = 0;
  let length = 0;
  let key = null;

  if (subject === null || toSignature.call(subject) !== objectSignature ||
    source === null || toSignature.call(source) !== objectSignature) {
    return subject;
  }

  properties = OBJECT_KEYS(source);
  length = properties.length;

  for (; length--; c++) {
    key = properties[c];
    subject[key] = source[key];
  }

  return subject;
}
