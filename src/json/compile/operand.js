
export function operand(node, code, symbols) {
  const symbol = node.symbol;
  let value = node.value;
  let length = code.length;
  let symbolLength = symbols.length;
  let initialized = false;

  // symbols[symbols.length] = node.
  // for identifier
  switch (node.id) {
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
    symbols[symbolLength++] = symbol;
    code[length++] = `${symbol} = ${value};`;
  }
}
