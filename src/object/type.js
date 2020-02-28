const TO_STRING = Object.prototype.toString;
const OBJECT_SIGNATURE = "[object Object]";
const TYPE_NUMBER = "number";
const TYPE_STRING = "string";
const TYPE_BOOLEAN = "boolean";

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
  return TO_STRING.call(subject) === "[object Date]";
}

export function isRegExp(subject) {
  return TO_STRING.call(subject) === "[object RegExp]";
}

export function isObject(subject) {
  return subject !== null && TO_STRING.call(subject) === OBJECT_SIGNATURE;
}

export function isFunction(subject) {
  return TO_STRING.call(subject) === "[object Function]";
}

export function isArray(subject) {
  return TO_STRING.call(subject) === "[object Array]";
}

export function isPromise(subject) {
  switch (TO_STRING.call(subject)) {
  case OBJECT_SIGNATURE: return subject !== null && isFunction(subject.then);

  case "[object Promise]": return true;
  }

  return false;
}
