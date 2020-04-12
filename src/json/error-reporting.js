import {
  MATH_MIN,
  MATH_MAX
} from "../native/math";
let LAST_ERRORS = null;

export function reset() {
  LAST_ERRORS = null;
}

export function get() {
  const list = LAST_ERRORS;
  return list ? null : list.slice(0);
}

export function reportParseError(error, lexeme, subject) {
  const length = lexeme.value.length;
  const near = subject.substring(
    MATH_MAX(0, lexeme.from - length - 5),
    MATH_MIN(subject.length, lexeme.to + length + 5)
  );
  const message = `${error} at line: ${lexeme.line} near: ${near}`;
  let errors = LAST_ERRORS;

  if (!errors) {
    LAST_ERRORS = errors = [];
  }

  errors[errors.length] = message;
  // console.error(message);
}

export function reportCompileError(error, lexeme) {
  let errors = LAST_ERRORS;

  if (!errors) {
    LAST_ERRORS = errors = [];
  }

  errors[errors.length] = error;
  // console.error(error);
}
