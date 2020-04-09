
function enforceNumberType(operand, code, symbols, allowString) {
  const symbol = operand.symbol;
  const symbolLength = symbols.length;
  const typeOfSymbol = symbols[symbolLength] = `typeOf${symbolLength}`;
  const allowStringCondition = allowString
    ? `${typeOfSymbol} !== "string" && (${typeOfSymbol} !== "number" || !finite(${symbol})`
    : `${typeOfSymbol} !== "number" || !finite(${symbol}`;

  code[code.length] = `${typeOfSymbol} = typeof ${symbol};
    if (${allowStringCondition}) {
      ${symbol} = 0;
    }`;
}

export function arithmetic(lexeme, symbols, operands) {
  const symbol = lexeme.symbol;
  const code = lexeme.code;
  const length = operands.length;
  let operator = "+";
  let operand = null;
  let allowString = false;
  let left = 0;
  let right = null;

  switch (lexeme.id) {
  case "add":
    operator = "+";
    allowString = true;
    break;

  case "sub":
    operator = "-";
    break;

  case "mul":
    operator = "*";
    break;

  case "div":
    operator = "/";
    break;

  case "mod":
    operator = "%";
    break;
  }

  // insert operand codes
  operand = operands[0];
  code.push.apply(code, operand.code);

  if (length > 1) {
    code.push.apply(code, operands[1].code);
  }

  // apply type check if augmented
  left = operand.symbol;
  if (operand.augmented) {
    enforceNumberType(operand, code, symbols, allowString);
  }

  // unary: zero minus operand
  if (operands.length === 1) {
    right = left;
    left = 0;
  }
  else {
    operand = operands[1];
    right = operand.symbol;

    if (operand.augmented) {
      enforceNumberType(operand, code, symbols, allowString);
    }
  }

  symbols[symbols.length] = symbol;

  code[code.length] = `${symbol} = ${left} ${operator} ${right};`;
}
