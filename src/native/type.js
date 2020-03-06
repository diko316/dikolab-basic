import {
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_BOOLEAN,
  TYPE_UNDEFINED,
  TYPE_BIGINT,
  TYPE_SYMBOL,

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

/**
 * Returns true. if "subject" parameter is String.
 *
 * @alias module:native.string
 * @borrows module:native.string as module:basic.string
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function string(subject) {
  return typeof subject === TYPE_STRING;
}

/**
 * Returns true. if "subject" parameter is Number.
 *
 * @alias module:native.number
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function number(subject) {
  return typeof subject === TYPE_NUMBER && isFinite(subject);
}

/**
 * Returns true. if "subject" parameter is BigInt.
 *
 * @alias module:native.bigint
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function bigint(subject) {
  return typeof subject === TYPE_BIGINT;
}

/**
 * Returns true. if "subject" parameter is Boolean.
 *
 * @alias module:native.boolean
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function boolean(subject) {
  return typeof subject === TYPE_BOOLEAN;
}

/**
 * Returns true. if "subject" parameter is Symbol.
 *
 * @alias module:native.symbol
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function symbol(subject) {
  return typeof subject === TYPE_SYMBOL;
}

/**
 * Returns true. if "subject" parameter is Numeric string, number, or bigint.
 *
 * @alias module:native.numeric
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function numeric(subject) {
  let result = subject;

  switch (typeof result) {
  case TYPE_STRING:
    result = parseInt(result, 10);

  // falls through
  case TYPE_NUMBER:
    return isFinite(result);

  case TYPE_BIGINT: return true;
  }

  return false;
}

/**
 * Returns true. if "subject" parameter is Scalar string, number, boolean, symbol, or bigint.
 *
 * @alias module:native.scalar
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function scalar(subject) {
  switch (typeof subject) {
  case TYPE_BIGINT:
  case TYPE_SYMBOL:
  case TYPE_STRING:
  case TYPE_BOOLEAN: return true;

  case TYPE_NUMBER: return isFinite(subject);
  }

  return false;
}

/**
 * Returns true. if "subject" parameter is an instance of Date.
 *
 * @alias module:native.date
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function date(subject) {
  return OBJECT_TO_STRING.call(subject) === DATE_SIGNATURE;
}

/**
 * Returns true. if "subject" parameter is an instance of RegExp.
 *
 * @alias module:native.regexp
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function regexp(subject) {
  return OBJECT_TO_STRING.call(subject) === REGEXP_SIGNATURE;
}

/**
 * Returns true. if "subject" parameter is an instance of User defined Object.
 *
 * @alias module:native.object
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function object(subject) {
  return subject !== null && OBJECT_TO_STRING.call(subject) === OBJECT_SIGNATURE;
}

/**
 * Returns true. if "subject" parameter is a Function.
 *
 * @alias module:native.method
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function method(subject) {
  return OBJECT_TO_STRING.call(subject) === FUNCTION_SIGNATURE;
}

/**
 * Returns true. if "subject" parameter is an Array.
 *
 * @alias module:native.array
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function array(subject) {
  return OBJECT_TO_STRING.call(subject) === ARRAY_SIGNATURE;
}

/**
 * Returns true. if "subject" parameter is a thenable Object or Promise.
 *
 * @alias module:native.promise
 * @param {*} subject value to test
 * @returns {boolean} result
 */
export function promise(subject) {
  switch (OBJECT_TO_STRING.call(subject)) {
  case OBJECT_SIGNATURE: return subject !== null && method(subject.then);

  case PROMISE_SIGNATURE: return true;
  }

  return false;
}

/**
 * Returns Object signature of "subject" parameter.
 * The Object signature in `[object ${ObjectName}]` syntax.
 * The value is extracted by using the value from Object.prototype.toString.call(subject) call.
 *
 * @alias module:native.signature
 * @param {*} subject value to test
 * @returns {string} resolved Object signature `[object ${ObjectName}]`
 */
export function signature(subject) {
  if (typeof subject === TYPE_UNDEFINED) {
    return UNDEFINED_SIGNATURE;
  }

  if (subject === null) {
    return NULL_SIGNATURE;
  }

  if (subject && method(subject.then)) {
    return PROMISE_SIGNATURE;
  }

  return OBJECT_TO_STRING.call(subject);
}
