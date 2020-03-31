import { LINE_CHARACTER } from "../constants";

export function preprocess(code) {
  // insert helpers
  code[code.length] = (
    [
      "var object = Object;",
      "var objectPrototype = object.prototype;",
      "var hasOwn = objectPrototype.hasownProperty;",
      "var signature = objectPrototype.toString;",
      "var finite = isFinite;",
      "var result = undefined;"
    ]
  ).join(LINE_CHARACTER);
}

export function postprocess(code, symbols) {
  let declare = null;
  let codeLength = code.length;

  if (symbols.length) {
    declare = symbols.join(`;${LINE_CHARACTER}var `);
    codeLength++;
    code.splice(
      0,
      0,
      `var ${declare};`
    );
  }

  // add unset symbols
  code[codeLength++] = `${symbols.join(" = ")} = null;`;
  code[codeLength++] = "return result;";
}
