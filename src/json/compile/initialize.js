import { EMPTY_STRING } from "../../native/constants";

export function initializeGet(node, code) {

}

export function initializeOperand(node, code, symbols) {
  const symbol = node.symbol;
  let value = node.value;
  let length = code.length;
  let symbolLength = symbols.length;
  let initialized = false;

  // symbols[symbols.length] = node.
  switch (node.dataType) {
  case "string":
    value = JSON.stringify(value);

  // falls through
  case "number":
    initialized = true;
    break;

  default:
    // for identifier
    if (node.id === "identifier") {
      value = JSON.stringify(node.value);
      initialized = true;
    }
  }
  if (initialized) {
    symbols[symbolLength++] = symbol;
    code[length++] = ([
      "var ",
      symbol,
      " = ",
      value,
      "; // "
    ]).join(EMPTY_STRING);
  }
}
