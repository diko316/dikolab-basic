
function populateObject(assign, parent, property, code, symbols, validate, validateProperty) {
  const symbolLength = symbols.length;
  const type = symbols[symbolLength] = `type${symbolLength}`;
  const validations = [];
  let validationsLength = 0;
  let length = code.length;

  code[length++] = `${type} = typeof ${property};`;

  if (validate) {
    validations[validationsLength++] = `(!${parent} || typeof ${parent} !== "object")`;
  }

  if (validateProperty) {
    validations[validationsLength++] = `(${type} !== "string" && !(${type} === "number" && finite(${property})))`;
  }

  if (validationsLength) {
    code[length++] = `if (${validations.join(" || ")}) {
    ${assign} = undefined;
} else `;
  }
  code[length++] = `if (!hasOwn.call(${parent}, ${property})) {
  ${parent}[${property}] = ${assign} = ${type} === "string" ? {} : [];
}
else {
  ${assign} = ${parent}[${property}];
}`;
}

function accessObject(assign, parent, property, code, symbols, validate, validateProperty) {
  let symbolLength = null;
  let type = null;
  let length = code.length;

  if (validateProperty) {
    symbolLength = symbols.length;
    type = symbols[symbolLength] = `type${symbolLength}`;
    code[length++] = `${type} = typeof ${property};`;
  }

  code[length++] = "if (";

  if (validate) {
    code[length++] = `(${parent} && typeof ${parent} === "object") &&`;
  }
  if (validateProperty) {
    code[length++] = `(${type} === "string" || (${type} === "number" && finite(${property}))) &&`;
  }

  code[length++] = `hasOwn.call(${parent}, ${property})
){
  ${assign} = ${parent}[${property}];
}
else {
  ${assign} = undefined;
}`;
}

export function access(features, node, code, symbols) {
  const symbol = node.symbol;
  const operands = node.arguments;
  const parent = operands[0];
  const property = operands[1];
  const propertySymbol = property.symbol;
  const populate = node.context === "set";
  let parentSymbol = parent.symbol;
  let augmentedSymbol = null;
  let symbolLength = null;
  let validateProperty = false;

  features.objectHasOwn = true;
  features.finite = true;

  // initialize
  if (!parent.augmented) {
    switch (parent.id) {
    case "string":
    case "number":
    case "identifier":
      validateProperty = false;
      break;
    default:
      validateProperty = true;
    }
    symbolLength = symbols.length;
    augmentedSymbol = symbols[symbolLength] = `augmentedParent${symbolLength}`;

    if (populate) {
      populateObject(
        augmentedSymbol,
        "root",
        parentSymbol,
        code,
        symbols,
        false,
        validateProperty
      );
    }
    else {
      accessObject(
        augmentedSymbol,
        "root",
        parentSymbol,
        code,
        symbols,
        false,
        validateProperty
      );
    }
    parentSymbol = augmentedSymbol;
  }

  switch (property.id) {
  case "string":
  case "number":
  case "identifier":
    validateProperty = false;
    break;
  default:
    validateProperty = true;
  }

  if (populate) {
    populateObject(
      symbol,
      parentSymbol,
      propertySymbol,
      code,
      symbols,
      true,
      validateProperty
    );
  }
  else {
    accessObject(
      symbol,
      parentSymbol,
      propertySymbol,
      code,
      symbols,
      true,
      validateProperty
    );
  }
}
