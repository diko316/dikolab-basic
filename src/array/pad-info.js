import {
  TYPE_STRING,
  TYPE_NUMBER
} from "../native/constants";

import { iteratable } from "../native/iteratable";

import { IS_FINITE } from "../native/number";

import {
  ARRAY_SLICE
} from "../native/array";

import {
  ARRAY_PAD_ERROR
} from "./contants";

/**
 * Iteratables are anything that has "length" property and
 * contains numerically indexed items.
 *
 * @typedef {(string|Array|IteratableObject)} Iteratable
 */

/**
 * Fixes parameters found in listPadStart and listPadEnd.
 *
 * @protected
 * @param {Iteratable} subject The iteratable to pad.
 * @param {number} pad The total length to pad.
 * @param {Iteratable} padList The items to fill-in.
 * @returns {Array} pad information.
 */
export function padInfo(subject, pad, padList) {
  const typeString = TYPE_STRING;
  const slice = ARRAY_SLICE;
  let main = subject;
  let totalPad = pad;
  let padItems = padList;

  if (!iteratable(subject)) {
    throw new TypeError(ARRAY_PAD_ERROR);
  }
  else if (typeof main === typeString) {
    main = slice.call(main, 0);
  }

  if (typeof totalPad !== TYPE_NUMBER || !IS_FINITE(totalPad) || totalPad < 0) {
    totalPad = 0;
  }

  if (!iteratable(padItems)) {
    padItems = [];
  }
  else if (typeof padItems === typeString) {
    padItems = slice.call(padItems, 0);
  }

  return [main, totalPad, padItems];
}
