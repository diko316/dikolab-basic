import { ARRAY_SLICE } from "../../native/array";

export function filterAmong(item) {
  return ARRAY_SLICE.call(arguments, 1).indexOf(item) !== -1;
}
