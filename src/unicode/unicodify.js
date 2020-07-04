
import { stringify } from "../string/stringify";

import {
  EMPTY_UNICODE,
  Utf
} from "./utf.class";

/**
 * Convert Scalar value to Unicode.
 *
 * @protected
 * @param {*} subject Scalar value to convert.
 * @param {*} [defaultValue=Utf] optional defaultValue to return if failed.
 * @returns {Utf|*} Unicode string when successful, or [defaultValue] parameter is returned if failed.
 */
export function unicodify(subject, defaultValue = EMPTY_UNICODE) {
  const stringified = stringify(subject, null);

  return stringified === null ? defaultValue : new Utf(stringified);
}
