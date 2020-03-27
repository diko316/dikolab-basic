import {
  MATH_MAX
} from "../native/math";

import {
  EMPTY_STRING
} from "../native/constants";

import {
  TOKENIZER_WILDCARD,
  TOKENIZER_KEYWORD_LIST
} from "./constants";

import STATES from "./tokenizer-states.json";

export function tokenize(input, startIndex) {
  const keywords = TOKENIZER_KEYWORD_LIST;
  const wildcard = TOKENIZER_WILDCARD;
  const reference = STATES;
  const states = reference.state;
  const ends = reference.ends;
  const anchor = MATH_MAX(0, 1 * startIndex || 0);
  let state = states[reference.startState];
  let length = input.length;
  let c = anchor;
  let nextIndex = c;
  let token = null;
  let char = null;
  let found = null;

  if (anchor === length) {
    token = reference.endToken;
    return [
      token,
      EMPTY_STRING,
      nextIndex + 1
    ];
  }
  else if (anchor > length) {
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

  // postprocess token
  if (token) {
    found = input.substring(anchor, nextIndex);

    switch (token) {
    case "ident":
      if (keywords.indexOf(found) !== -1) {
        token = found;
      }
      break;
    }

    return [
      token,
      found,
      nextIndex
    ];
  }

  return null;
}
