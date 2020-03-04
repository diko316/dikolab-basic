import {
  TYPE_STRING,
  TYPE_NUMBER,
  TYPE_BOOLEAN
} from "../native";

export function numberify(subject, defaultValue = 0) {
  let value = subject;

  switch (typeof value) {
  case TYPE_STRING:
    value = parseFloat(value);

  // falls through
  case TYPE_NUMBER: return isFinite(value) ? value : defaultValue;

  case TYPE_BOOLEAN: return value ? 1 : 0;
  }

  return defaultValue;
}
