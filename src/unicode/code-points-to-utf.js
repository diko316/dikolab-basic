import { array } from "../native/array";
import { CODE_POINTS_TO_UTF_ERROR } from "./constants";
import { Utf } from "./utf.class";

import { codePointToString } from "./code-point-to-string";

/**
 * Create Utf based on Array of code points parameter.
 * Error will be thrown if parameter is invalid.
 *
 * @param {number[]} codes Array of code points.
 * @returns {Utf} Utf instance.
 */
export function codePointsToUtf(codes) {
  if (!array(codes)) {
    throw new Error(CODE_POINTS_TO_UTF_ERROR);
  }

  return new Utf(
    codePointToString(...codes)
  );
}
