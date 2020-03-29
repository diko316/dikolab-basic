import { EMPTY_STRING } from "../../native/constants";

export function add(node, code, symbols, operands) {
  const symbol = node.symbol;
  let addend1 = 0;
  let addend2 = operands[0].symbol;

  if (operands.length > 1) {
    addend1 = addend2;
    addend2 = operands[1].symbol;
  }

  symbols[symbols.length] = symbol;
  code[code.length] = (
    [
      "var ",
      symbol,
      " = ",
      addend1,
      " + ",
      addend2,
      "; // "
    ]
  ).join(EMPTY_STRING);
}

export function sub(node, code, symbols, operands) {
  const symbol = node.symbol;
  let minuend = 0;
  let subtrahend = operands[0].symbol;

  if (operands.length > 1) {
    minuend = subtrahend;
    subtrahend = operands[1].symbol;
  }

  symbols[symbols.length] = symbol;
  code[code.length] = (
    [
      "var ",
      symbol,
      " = ",
      minuend,
      " - ",
      subtrahend,
      "; // "
    ]
  ).join(EMPTY_STRING);
}

export function mul(node, code, symbols, operands) {
  const symbol = node.symbol;

  symbols[symbols.length] = symbol;
  code[code.length] = (
    [
      "var ",
      symbol,
      " = ",
      operands[0].symbol,
      " * ",
      operands[1].symbol,
      "; // "
    ]
  ).join(EMPTY_STRING);
}
