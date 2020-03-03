import { numberify } from "../number/type-cast";

import {
  stringify
} from "./type-cast";

export function repeat(subject, count) {
  const value = stringify(subject);
  let length = numberify(count);
  let list = null;

  if (!value || length < 1) {
    return value;
  }
  
  list = [];

  for (let c = 0; length--; c++) {
    list[c] = value;
  }

  return list.join("");
}

// export function pad(subject, count, padString) {
//   const value = stringify(subject);
//   const padStr = repeat(padString, count);
// }