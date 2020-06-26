import {
  OBJECT_KEYS,
  OBJECT_TO_STRING
} from "../../native/object";

import {
  ARRAY_SIGNATURE,
  OBJECT_SIGNATURE
} from "../../native/constants";

export function keys(subject) {
  switch (OBJECT_TO_STRING.call(subject)) {
  case ARRAY_SIGNATURE:
  case OBJECT_SIGNATURE:
    return OBJECT_KEYS(subject);
  }

  return [];
}
