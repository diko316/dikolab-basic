import { EMPTY_STRING } from "../../native/constants";

export function condition(lexeme, left, right) {
  const empty = EMPTY_STRING;
  const code = lexeme.code;
  const symbol = lexeme.symbol;
  const leftSymbol = left.symbol;
  const rightSymbol = right.symbol;
  let length = code.length;
  let operator = "===";

  // insert operand codes
  code.push.apply(code, left);
  code.push.apply(code, right);

  switch (lexeme.id) {
  case "neq": operator = "!=="; break;
  case "gt": operator = ">"; break;
  case "gte": operator = ">="; break;
  case "lt": operator = "<"; break;
  case "lte": operator = "<="; break;
  case "pattern":
    operator = right.agumented || right.id !== "regex"
      ? `signature.call(${rightSymbol}) === "[object RegExp]" && `
      : empty;

    // validate regexp
    code[length++] = `${symbol} = ${operator}${rightSymbol}.test(${leftSymbol});`;
    return;
  }

  code[length++] = `${symbol} = ${leftSymbol} ${operator} ${rightSymbol};`;
}
