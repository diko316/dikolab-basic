let LAST_ERRORS = null;

export function reportParseError(error, line, from, to) {
  let errors = LAST_ERRORS;

  if (!errors) {
    LAST_ERRORS = errors = [];
  }

  errors[errors.length] = error;
  console.log(error);
}

export function reportCompileError(error, node) {
  let errors = LAST_ERRORS;

  if (!errors) {
    LAST_ERRORS = errors = [];
  }

  errors[errors.length] = error;
  console.log(error);
}
