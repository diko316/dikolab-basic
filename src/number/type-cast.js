
export function numberify(subject, defaultValue = 0) {
  let value = subject;

  switch (typeof value) {
  case "string":
    value = parseFloat(value);

  // falls through
  case "number":
    if (isFinite(value)) {
      return value;
    }
    break;

  case "boolean":
    return value ? 1 : 0;
  }

  return defaultValue;
}

