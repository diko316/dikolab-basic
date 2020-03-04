import { EMPTY_STRING } from "../native";
import { numberify } from "../number/type-cast";

import {
  stringify
} from "./type-cast";

export function repeat(subject, count) {
  const value = stringify(subject);
  let length = numberify(count, null);
  let list = null;

  if (!value || length === null || length < 1) {
    return value;
  }

  list = [];

  for (let c = 0; length--; c++) {
    list[c] = value;
  }

  return list.join(EMPTY_STRING);
}

export function trim() {
}

export function trimBefore() {
}

export function trimAfter() {
}
