import {
  iteratable
} from "../native/type";

import {
  TYPE_STRING,
  TYPE_NUMBER
} from "../native/constants";

import { IS_FINITE } from "../native/number";

import { MATH_MAX } from "../native/math";

import {
  ARRAY_SLICE
} from "../native/array";

import {
  ARRAY_PAD_ERROR
} from "./contants";

/**
 * @typedef {object} IteratableObject
 * @property {number} length
 */

/**
 * Iteratables are anything that has "length" property and
 * contains numerically indexed items.
 *
 * @typedef {(string|Array|IteratableObject)} Iteratable
 */

/**
 * Fixes parameters found in listPadStart and listPadEnd.
 *
 * @private
 * @param {Iteratable} subject The iteratable to pad.
 * @param {number} pad The total length to pad.
 * @param {Iteratable} padList The items to fill-in.
 * @returns {Array} pad information.
 */
function padInfo(subject, pad, padList) {
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

export function listPadStart(subject, pad, padList) {
  const max = MATH_MAX;
  const info = padInfo(subject, pad, padList);
  const main = info[0];
  const total = info[1];
  const list = info[2];
  const result = [];
  const padLength = list.length;
  const mainLength = main.length;
  let padItemsLength = padLength;
  let length = max(
    0,
    max(
      mainLength,
      padLength,
      total
    ) - mainLength
  );
  let resultLength = 0;
  let c = 0;

  for (; length-- && padItemsLength--; c++) {
    result[resultLength++] = list[c];
    if (padItemsLength === 0) {
      padItemsLength = padLength;
      c = -1;
    }
  }

  result.push.apply(result, main);

  return result;
}

export function listPadEnd(subject, pad, padList) {
  const max = MATH_MAX;
  const info = padInfo(subject, pad, padList);
  const main = info[0];
  const total = info[1];
  const list = info[2];
  const result = [];
  const padLength = list.length;
  const mainLength = main.length;
  let padItemsLength = padLength;
  let length = max(
    0,
    max(
      mainLength,
      padLength,
      total
    ) - mainLength
  );
  let c = 0;
  let resultLength = mainLength;

  result.push.apply(result, main);

  for (; length-- && padItemsLength--; c++) {
    result[resultLength++] = list[c];
    if (padItemsLength === 0) {
      padItemsLength = padLength;
      c = -1;
    }
  }

  return result;
}
