import { LINE_CHARACTER } from "../constants";

const FEATURE_LIST = [
  "objectPrototype",
  "finite",
  "signature",
  "objectHasOwn",
  "symbols"
];

export function preprocess(code) {
  // insert helpers
  code[code.length] = `var result = undefined;

if (root === null || typeof root !== "object") {
  return result;
}
  `;
}

export function postprocess(code, symbols, features) {
  const line = LINE_CHARACTER;
  const list = FEATURE_LIST;
  const precodes = [];
  const postcodes = [];
  let nullfills = [];
  let c = 0;
  let length = list.length;
  let item = null;
  let precodesLength = 0;
  let postcodesLength = 0;
  let nullfillsLength = 0;

  if (features.signature || features.objectHasOwn) {
    features.objectPrototype = true;
  }

  for (; length--; c++) {
    item = list[c];
    if (!(item in features) || features[item] === false) {
      continue;
    }
    switch (item) {
    case "objectPrototype":
      precodes[precodesLength++] = "var object = Object;";
      precodes[precodesLength++] = "var objectPrototype = object.prototype;";
      nullfills[nullfillsLength++] = "object";
      nullfills[nullfillsLength++] = "objectPrototype";
      break;

    case "finite":
      precodes[precodesLength++] = "var finite = isFinite;";
      nullfills[nullfillsLength++] = "finite";
      break;

    case "signature":
      precodes[precodesLength++] = "var signature = objectPrototype.toString;";
      nullfills[nullfillsLength++] = "signature";
      break;

    case "objectHasOwn":
      precodes[precodesLength++] = "var hasOwn = objectPrototype.hasOwnProperty;";
      nullfills[nullfillsLength++] = "hasOwn";
      break;

    case "symbols":
      if (symbols.length) {
        precodes[precodesLength++] = `var ${symbols.join(`;${line}var `)};`;
      }

      if (nullfillsLength) {
        nullfills.reverse();
        nullfills = symbols.concat(nullfills);
      }
      else {
        nullfills = symbols;
      }

      if (nullfills.length) {
        postcodes[postcodesLength++] = `${nullfills.join(" = ")} = null;`;
      }
    }
  }

  if (precodesLength) {
    code.splice(
      0,
      0,
      precodes.join(line)
    );
  }
  if (postcodesLength) {
    code.push.apply(
      code,
      postcodes
    );
  }
}
