import {
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_BOOLEAN,
  isRegExp
} from "../object";

export function stringify(subject, defaultValue = "") {
  if (isRegExp(subject)) {
    return subject.toString();
  }

  switch (typeof subject) {
  case TYPE_BOOLEAN: return subject ? "true" : "false";
  case TYPE_NUMBER:
    if (isFinite(subject)) {
      return subject.toString(10);
    }
    break;
  case TYPE_STRING: return subject;
  }

  return defaultValue;
}
