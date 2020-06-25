import { IS_FINITE } from "../../native/number";
import {
  TYPE_STRING,
  TYPE_NUMBER
} from "../../native/constants";

export function filterBetween(item, from, to) {
  const typeNumber = TYPE_NUMBER;
  const typeString = TYPE_STRING;
  const isFinite = IS_FINITE;

  let numericFrom = from;
  let numericTo = to;

  if (!isFinite(item)) {
    return false;
  }

  switch (typeof from) {
  case typeString:
    numericFrom = parseInt(from, 10);
  // falls through
  case typeNumber:
    break;
  default:
    if (!isFinite(from)) {
      return false;
    }
  }

  switch (typeof to) {
  case typeString:
    numericTo = parseInt(to, 10);
  // falls through
  case typeNumber:
    break;
  default:
    if (!isFinite(to)) {
      return false;
    }
  }

  return numericFrom <= item && item <= numericTo;
}
