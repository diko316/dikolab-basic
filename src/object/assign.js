import { OBJECT_SIGNATURE } from "../native/constants";

import {
  OBJECT_KEYS,
  OBJECT_TO_STRING
} from "../native/object";

import {
  ASSIGN_ERROR_INVALID_SOURCE,
  ASSIGN_ERROR_INVALID_SUBJECT
} from "./constants";

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

  if (toSignature.call(subject) !== objectSignature) {
    throw new Error(ASSIGN_ERROR_INVALID_SUBJECT);
  }

  if (toSignature.call(source) !== objectSignature) {
    throw new Error(ASSIGN_ERROR_INVALID_SOURCE);
  }

  properties = OBJECT_KEYS(source);
  length = properties.length;

  for (; length--; c++) {
    key = properties[c];
    subject[key] = source[key];
  }

  return subject;
}
