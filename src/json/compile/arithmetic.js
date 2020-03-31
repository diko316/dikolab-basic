import { LINE_CHARACTER } from "../constants";

function enforceNumberType(operand, code, symbols, allowString) {
  const symbol = operand.symbol;
  const symbolLength = symbols.length;
  const typeOfSymbol = symbols[symbolLength] = `typeOf${symbolLength}`;

  code[code.length] = (
    [
      `${typeOfSymbol} = typeof ${symbol};`,
      allowString
        ? `if (${typeOfSymbol} !== "string" || !(${typeOfSymbol} === "number" && finite(${symbol})) {`
        : `if (${typeOfSymbol} !== "number" || !finite(${symbol}){`,
      ") {",
      `${symbol} = 0;`,
      "}"
    ]
  ).join(LINE_CHARACTER);
}

export function arithmetic(node, code, symbols) {
  const symbol = node.symbol;
  const operands = node.operands;
  let operator = "+";
  let operand = null;
  let allowString = false;
  let left = 0;
  let right = null;

  switch (node.id) {
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

  // apply type check if augmented
  operand = operands[0];
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
