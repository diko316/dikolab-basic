import {
  MATH_MAX
} from "../native/math";

import {
  EMPTY_STRING
} from "../native/constants";

import {
  TOKENIZER_WILDCARD,
  TOKENIZER_KEYWORD_LIST,
  LINE_CHARACTER,
  DOUBLE_QUOTE,
  ESCAPED_DOUBLE_QUOTE,
  SINGLE_QUOTE,
  ESCAPED_SINGLE_QUOTE,
  SINGLE_TO_DOUBLE_QUOTE
} from "./constants";

import STATES from "./tokenizer-states.json";

function replaceSingleQuote(all) {
  switch (all) {
  case DOUBLE_QUOTE: return ESCAPED_DOUBLE_QUOTE;
  case ESCAPED_SINGLE_QUOTE: return SINGLE_QUOTE;
  }
  return all;
}

export function tokenize(input, startIndex) {
  const emptyString = EMPTY_STRING;
  const doubleQuote = DOUBLE_QUOTE;
  const singleToDoubleQuoteRegexp = SINGLE_TO_DOUBLE_QUOTE;
  const keywords = TOKENIZER_KEYWORD_LIST;
  const wildcard = TOKENIZER_WILDCARD;
  const reference = STATES;
  const states = reference.state;
  const ends = reference.ends;
  const anchor = MATH_MAX(0, 1 * startIndex || 0);
  const lineCharacter = LINE_CHARACTER;

  let state = states[reference.startState];
  let length = input.length;
  let c = anchor;
  let nextIndex = c;
  let token = null;
  let char = null;
  let found = null;
  let line = 0;

  if (anchor === length) {
    return [
      reference.endToken,
      emptyString,
      nextIndex + 1,
      line
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
    line = found.split(lineCharacter).length - 1;

    switch (token) {
    case "ident":
      if (keywords.indexOf(found) !== -1) {
        token = found;
      }
      break;
    case "string":
      found = JSON.parse(
        found.charAt(0) === doubleQuote
          ? found
          : ([
            doubleQuote,
            found.substring(1, found.length - 1).replace(singleToDoubleQuoteRegexp, replaceSingleQuote),
            doubleQuote
          ]).join(emptyString)
      );
      break;
    case ":call(":
      found = found.substring(1, found.length - 1);
      break;
    }

    return [
      token,
      found,
      nextIndex,
      line
    ];
  }

  return null;
}
