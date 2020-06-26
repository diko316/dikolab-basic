import { OBJECT_TO_STRING } from "../../native/object";

import { ARRAY_SLICE } from "../../native/array";

import {
  ARRAY_SIGNATURE,
  OBJECT_SIGNATURE,
  STRING_SIGNATURE
} from "../../native/constants";

export function filterIn(item, values) {
  switch (OBJECT_TO_STRING.call(values)) {
  case STRING_SIGNATURE:
  case OBJECT_SIGNATURE:
    return ARRAY_SLICE.call(values, 0) !== -1;

  case ARRAY_SIGNATURE:
    return values.indexOf(item) !== -1;
  }

  return false;
}
