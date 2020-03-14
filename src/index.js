/**
 * @module basic
 */
export {
  string,
  number,
  boolean,
  numeric,
  bigint,
  symbol,
  scalar,
  date,
  regexp,
  object,
  array,
  method,
  promise,
  signature
} from "./native";

export {
  numberify
} from "./number";

export {
  repeat
} from "./string";

export {
  Utf,

  eachUnicode,
  string2unicodes,
  string2codePoints,
  codePoint2string,

  unicodify,
  unicodeCount,
  codepoints2Utf
} from "./unicode";

export {
  destructor
} from "./lifecycle";
