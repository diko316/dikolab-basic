import { EMPTY_STRING } from "../../native/constants";

export function condition(node, code) {
  const empty = EMPTY_STRING;
  const symbol = node.symbol;
  const operands = node.operands;
  const leftSymbol = operands[0].symbol;
  const right = operands[1];
  const rightSymbol = right.symbol;
  let length = code.length;
  let operator = "===";

  switch (node.id) {
  case "neq": operator = "!=="; break;
  case "gt": operator = ">"; break;
  case "gte": operator = ">="; break;
  case "lt": operator = "<"; break;
  case "lte": operator = "<="; break;
  case "pattern":
    // validate regexp
    code[length++] = (
      [
        `${symbol} = `,
        right.agumented || right.id !== "regex"
          ? `signature.call(${rightSymbol}) === "[object RegExp]" && `
          : empty,
        `${rightSymbol}.test(${leftSymbol});`
      ]
    ).join(empty);
    return;
  }

  code[length++] = `${symbol} = ${leftSymbol} ${operator} ${rightSymbol};`;
}
