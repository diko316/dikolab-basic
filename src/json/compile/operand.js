
export function operand(lexeme) {
  const symbol = lexeme.symbol;
  const code = lexeme.code;
  let value = lexeme.value;
  let initialized = false;

  // symbols[symbols.length] = node.
  // for identifier
  switch (lexeme.rule) {
  case "string":
  case "identifier":
    value = JSON.stringify(value);

  // falls through
  case "number":
    initialized = true;
    break;

  case "regex":
    value = JSON.stringify(value.substring(1, value.length - 1));
    value = `new RegExp(${value})`;
    initialized = true;
  }

  if (initialized) {
    code[code.length] = `${symbol} = ${value};`;
  }
}
