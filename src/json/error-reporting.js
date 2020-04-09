let LAST_ERRORS = null;

export function reportParseError(error, lexeme) {
  let errors = LAST_ERRORS;

  if (!errors) {
    LAST_ERRORS = errors = [];
  }

  errors[errors.length] = error;
  console.error(error);
}

export function reportCompileError(error, lexeme) {
  let errors = LAST_ERRORS;

  if (!errors) {
    LAST_ERRORS = errors = [];
  }

  errors[errors.length] = error;
  console.error(error);
}
