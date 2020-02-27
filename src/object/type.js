const TO_STRING = Object.prototype.toString;
const OBJECT_SIGNATURE = '[object Object]';

export function isString(subject) {
  return typeof subject === 'string';
}

export function isNumber(subject) {
  return typeof subject === 'number' && isFinite(subject);
}

export function isBoolean(subject) {
  return typeof subject === 'boolean';
}

export function isScalar(subject) {
  switch (typeof subject) {
    case 'string':
    case 'boolean': return true;

    case 'number': return isFinite(subject);
  }

  return false;
}

export function isDate(subject) {
  return TO_STRING.call(subject) === '[object Date]';
}

export function isRegExp(subject) {
  return TO_STRING.call(subject) === '[object RegExp]';
}

export function isObject(subject) {
  return TO_STRING.call(subject) === OBJECT_SIGNATURE;
}

export function isFunction(subject) {
  return TO_STRING.call(subject) === '[object Function]';
}

export function isArray(subject) {
  return TO_STRING.call(subject) === '[object Array]';
}

export function isPromise(subject) {
  switch (TO_STRING.call(subject)) {
    case OBJECT_SIGNATURE: return isFunction(subject.then);

    case '[object Promise]': return true;
  }

  return false;
}
