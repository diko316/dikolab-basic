import {
  MATH_MAX
} from "../native/math";

import {
  TOKENIZER_START_STATE,
  TOKENIZER_WILDCARD
} from "./constants";
import STATES from "./tokenizer-states.json";

export function tokenize(input, startIndex) {
  const wildcard = TOKENIZER_WILDCARD;
  const reference = STATES;
  const states = reference.state;
  const ends = reference.ends;
  const anchor = MATH_MAX(0, 1 * startIndex || 0);
  let state = states[TOKENIZER_START_STATE];
  let length = input.length;
  let c = anchor;
  let nextIndex = c;
  let token = null;
  let char = null;
  let found = null;

  if (anchor >= length) {
    return null;
  }

  for (; length--; c++) {
    char = input.charAt(c);

    found = char in state
      ? state[char]
      : wildcard in state
        ? state[wildcard]
        : false;

    if (found) {
      // change state
      state = states[found];

      if (found in ends) {
        nextIndex = c + 1;
        token = ends[found];
      }
      continue;
    }

    break;
  }

  return token
    ? [
      token,
      input.substring(anchor, nextIndex),
      nextIndex
    ]
    : null;
}
