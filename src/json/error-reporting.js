import {
  EMPTY_STRING
} from "../native/constants";
import {
  MATH_MIN,
  MATH_MAX
} from "../native/math";

let LAST_ERRORS = null;

let SHOW_ERRORS = false;

export function reset() {
  LAST_ERRORS = null;
}

export function get() {
  const list = LAST_ERRORS;
  return list ? null : list.slice(0);
}

export function showErrors(show) {
  SHOW_ERRORS = show !== false;
}

export function reportParseError(errorMessage, subject, from, to, lineFrom, lineTo) {
  const line = lineFrom === lineTo ? `${lineFrom}` : `${lineFrom} to ${lineTo}`;
  const near = subject.substring(
    MATH_MAX(0, from - 5),
    MATH_MIN(subject.length, to + 5)
  );
  const message = `Parse Error: ${errorMessage} at line: ${line} near: ${near}`;
  let errors = LAST_ERRORS;

  if (!errors) {
    LAST_ERRORS = errors = [];
  }

  errors[errors.length] = message;
  if (SHOW_ERRORS) {
    console.error(message);
  }
}

export function reportCompileError(error, lexeme, subject) {
  const value = lexeme.value || EMPTY_STRING;
  const length = value.length;
  const near = subject.substring(
    MATH_MAX(0, lexeme.from - length - 5),
    MATH_MIN(subject.length, lexeme.to + length + 5)
  );
  const message = `Compile Error: ${error} (${value}) at line: ${lexeme.line} near: ${near}`;
  let errors = LAST_ERRORS;

  if (!errors) {
    LAST_ERRORS = errors = [];
  }

  errors[errors.length] = message;
  if (SHOW_ERRORS) {
    console.error(message);
  }
}
