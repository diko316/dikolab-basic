import {
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_BOOLEAN,
  TYPE_UNDEFINED,

  OBJECT_SIGNATURE,
  FUNCTION_SIGNATURE,
  ARRAY_SIGNATURE,
  DATE_SIGNATURE,
  REGEXP_SIGNATURE,
  PROMISE_SIGNATURE,
  UNDEFINED_SIGNATURE,
  NULL_SIGNATURE
} from "./constants";

import { OBJECT_TO_STRING } from "./object";

export function isString(subject) {
  return typeof subject === TYPE_STRING;
}

export function isNumber(subject) {
  return typeof subject === TYPE_NUMBER && isFinite(subject);
}

export function isBoolean(subject) {
  return typeof subject === TYPE_BOOLEAN;
}

export function isNumeric(subject) {
  let result = subject;

  switch (typeof result) {
  case TYPE_STRING:
    result = parseInt(result, 10);

  // falls through
  case TYPE_NUMBER:
    return isFinite(result);
  }

  return false;
}

export function isScalar(subject) {
  switch (typeof subject) {
  case TYPE_STRING:
  case TYPE_BOOLEAN: return true;

  case TYPE_NUMBER: return isFinite(subject);
  }

  return false;
}

export function isDate(subject) {
  return OBJECT_TO_STRING.call(subject) === DATE_SIGNATURE;
}

export function isRegExp(subject) {
  return OBJECT_TO_STRING.call(subject) === REGEXP_SIGNATURE;
}

export function isObject(subject) {
  return subject !== null && OBJECT_TO_STRING.call(subject) === OBJECT_SIGNATURE;
}

export function isFunction(subject) {
  return OBJECT_TO_STRING.call(subject) === FUNCTION_SIGNATURE;
}

export function isArray(subject) {
  return OBJECT_TO_STRING.call(subject) === ARRAY_SIGNATURE;
}

export function isPromise(subject) {
  switch (OBJECT_TO_STRING.call(subject)) {
  case OBJECT_SIGNATURE: return subject !== null && isFunction(subject.then);

  case PROMISE_SIGNATURE: return true;
  }

  return false;
}

export function signature(subject) {
  if (typeof subject === TYPE_UNDEFINED) {
    return UNDEFINED_SIGNATURE;
  }

  if (subject === null) {
    return NULL_SIGNATURE;
  }

  if (subject && isFunction(subject.then)) {
    return PROMISE_SIGNATURE;
  }

  return OBJECT_TO_STRING.call(subject);
}
