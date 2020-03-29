let LAST_PARSE_ERRORS = null;

export function reportParseError(error, subject, line, from, to) {
  let errors = LAST_PARSE_ERRORS;

  if (!errors) {
    LAST_PARSE_ERRORS = errors = [];
  }

  errors[errors.length] = error;
  console.log(error);
}
