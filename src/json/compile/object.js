import { EMPTY_STRING } from "../../native/constants";
import { LINE_CHARACTER } from "../constants";

function accessGet(assignSymbol, parentSymbol, propertySymbol, symbols) {
  const line = LINE_CHARACTER;
  let length = symbols.length;
  let validParent = null;
  let propertyType = null;
  let validProperty = null;

  validParent = symbols[length++] = `validParent${length}`;
  propertyType = symbols[length++] = `propertyType${length}`;
  validProperty = symbols[length++] = `validPropertyType${length}`;

  return ([
    `${validParent} = ${parentSymbol} !== null && `,
    `typeof ${parentSymbol} === "object";${line}`,
    `${propertyType} = typeof ${propertySymbol};${line}`,
    `${validProperty} = ${propertyType} === "string" || (`,
    `${propertyType} === "number" && finite(${propertySymbol}));${line}`,
    `if (${validParent} && ${validProperty} && `,
    `hasOwn.call(${parentSymbol},${propertySymbol})) {${line}`,
    `${assignSymbol} = ${parentSymbol}[${propertySymbol}];${line}}${line}`
  ]).join(EMPTY_STRING);
}

function accessSet(assignSymbol, parentSymbol, propertySymbol, symbols) {
  const line = LINE_CHARACTER;
  let length = symbols.length;
  let validParent = null;
  let propertyType = null;
  let validProperty = null;

  validParent = symbols[length++] = `validParent${length}`;
  propertyType = symbols[length++] = `propertyType${length}`;
  validProperty = symbols[length++] = `validPropertyType${length}`;

  return ([
    `${validParent} = ${parentSymbol} !== null && `,
    `typeof ${parentSymbol} === "object";${line}`,
    `${propertyType} = typeof ${propertySymbol};${line}`,
    `${validProperty} = ${propertyType} === "string" || (`,
    `${propertyType} === "number" && finite(${propertySymbol}));${line}`,
    `if (${validParent} && ${validProperty}) {${line}`,
    `if (!hasOwn.call(${parentSymbol}, ${propertySymbol})) {${line}`,
    `${parentSymbol}[${propertySymbol}] = `,
    `typeof ${propertySymbol} === "string" ? {} : [];}${line}`,
    `${assignSymbol} = ${parentSymbol}[${propertySymbol}];${line}`,
    `}${line}`
  ]).join(EMPTY_STRING);
}

export function access(node, code, symbols) {
  const symbol = node.symbol;
  const operands = node.operands;
  const parent = operands[0];
  const property = operands[1];
  const subCode = [];
  let length = 0;
  let accessMethod = accessGet;

  switch (node.context) {
  case "set":
    accessMethod = accessSet;
  }

  // initialize
  if (!parent.augmented) {
    subCode[length++] = accessMethod(
      parent.symbol,
      "root",
      parent.symbol,
      symbols
    );
  }

  symbols[symbols.length] = symbol;
  code[code.length] = (
    [
      subCode.join(EMPTY_STRING),
      symbol, " = undefined;", LINE_CHARACTER,
      accessMethod(
        node.symbol,
        parent.symbol,
        property.symbol,
        symbols
      )
    ]
  ).join(EMPTY_STRING);
}
