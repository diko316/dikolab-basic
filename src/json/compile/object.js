import { EMPTY_STRING } from "../../native/constants";

function accessCode(assignSymbol, parentSymbol, propertySymbol) {
  return ([
    "if (Object.prototype.hasOwnProperty.call(",
    parentSymbol,
    ",",
    propertySymbol,
    ") {",
    assignSymbol,
    " = ",
    parentSymbol,
    "[",
    propertySymbol,
    "];",
    "}\n"
  ]).join(EMPTY_STRING);
}

export function access(node, code, symbols, operands, context) {
  const symbol = node.symbol;
  const parent = operands[0];
  const property = operands[1];
  const subCode = [];
  let length = 0;

  // initialize
  if (!parent.augmented) {
    subCode[length++] = accessCode(
      parent.symbol,
      "root",
      parent.symbol
    );
  }

  symbols[symbols.length] = symbol;
  code[code.length] = (
    [
      subCode.join(EMPTY_STRING),
      "var ", symbol, ";\n",
      accessCode(
        node.symbol,
        parent.symbol,
        property.symbol
      )
    ]
  ).join(EMPTY_STRING);
}