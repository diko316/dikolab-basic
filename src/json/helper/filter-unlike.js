import { OBJECT_TO_STRING } from "../../native/object";
import {
  REGEXP_SIGNATURE,
  STRING_SIGNATURE,
  TYPE_BIGINT,
  TYPE_BOOLEAN,
  TYPE_STRING,
  TYPE_NUMBER,
  ARRAY_SIGNATURE
} from "../../native/constants";

export function filterUnlike(item, matcher) {
  switch (OBJECT_TO_STRING.call(matcher)) {
  case REGEXP_SIGNATURE:
    return !matcher.test(item);

  case STRING_SIGNATURE:
    switch (typeof item) {
    case TYPE_BIGINT:
    case TYPE_BOOLEAN:
    case TYPE_STRING:
    case TYPE_NUMBER:
      return String(item).indexOf(matcher) === -1;
    }
    return false;

  case ARRAY_SIGNATURE:
    return item.indexOf(matcher) === -1;
  }

  return item !== matcher;
}
