import {
  TYPE_STRING,
  TYPE_NUMBER,
  TYPE_BOOLEAN
} from "../object";

export function numberify(subject, defaultValue = 0) {
  let value = subject;

  switch (typeof value) {
  case TYPE_STRING:
    value = parseFloat(value);

  // falls through
  case TYPE_NUMBER:
    if (isFinite(value)) {
      return value;
    }
    break;

  case TYPE_BOOLEAN:
    return value ? 1 : 0;
  }

  return defaultValue;
}

