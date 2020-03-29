import MANIFEST from "./parser-reference.json";

import { tokenize } from "./tokenizer";

import { reportParseError } from "./error-reporting";

export function parse(subject) {
  const manifest = MANIFEST;
  const reference = manifest.reference;
  const nodeTypes = manifest.types;
  const report = reportParseError;
  const rpn = [];
  const stack = [];
  const enclosureStack = [];

  let rpnLength = 0;
  let stackLength = 0;
  let enclosureStackLength = 0;
  let enclosure = null;

  let ignored = false;
  let token = null;
  let node = null;
  let nodeBefore = null;
  let definition = null;
  let index = 0;
  let id = null;
  let from = 0;
  let to = 0;
  let line = 1;
  let item = null;
  let precedence = 0;
  let symbolGen = 0;

  for (token = tokenize(subject, index); token; token = tokenize(subject, index)) {
    id = token[0];
    from = index;
    index = to = token[2];
    line += token[3];
    token = token[1];

    definition = reference[id];

    node = {
      id: definition[1],
      type: nodeTypes[definition[0]],
      dataType: definition[6],
      symbol: `${definition[1]}${++symbolGen}`,
      value: token,
      operands: definition[2],
      precedence: definition[4],
      rightAssiociative: definition[5] === 1,
      from,
      to,
      line
    };

    switch (definition[0]) {
    case 0: // ignore
      ignored = true;
      break;

    case 1: // operator
      // inspect if unary
      if (definition[3] &&
        (!nodeBefore ||
          nodeBefore.type === "operator" ||
          nodeBefore.type === "enclosure_start" ||
          nodeBefore.type === "enclosure_separator"
        )
      ) {
        node.operands = 1;
      }

      precedence = node.precedence;

      // pop
      for (; stackLength; stackLength--) {
        item = stack[stackLength - 1];
        if (
          item.type !== "enclosure_start" &&
          (
            item.precedence > precedence ||
            (
              item.precedence === precedence &&
              !item.rightAssiociative
            )
          )
        ) {
          rpn[rpnLength++] = item;
          continue;
        }
        break;
      }
      // push
      if (node.operands > 0) {
        stack[stackLength++] = node;
      }
      else {
        rpn[rpnLength++] = node;
      }
      break;

    case 2: // operand
      rpn[rpnLength++] = node;

      if (enclosure && !enclosure.operands) {
        enclosure.operands = 1;
      }

      // pop unary
      if (stackLength &&
        stack[stackLength - 1].operands < 2 &&
        stack[stackLength - 1].type !== "enclosure_start"
      ) {
        rpn[rpnLength++] = stack[--stackLength];
      }
      break;

    case 3: // start
      node.ender = definition[7];
      node.separator = definition[8];

      if (enclosure && !enclosure.operands) {
        enclosure.operands = 1;
      }
      stack[stackLength++] = node;
      enclosureStack[enclosureStackLength++] = enclosure = node;
      break;

    case 4: // ender
      if (!enclosureStackLength) {
        report(
          `Invalid token found ${token}.`,
          null,
          line,
          from,
          to
        );
        return null;
      }

      if (enclosure.ender !== node.id) {
        report(
          `Invalid terminating token found ${token}.`,
          null,
          line,
          from,
          to
        );
        return null;
      }
      // pop all
      for (; stackLength--;) {
        item = stack[stackLength];
        if (item.id === enclosure.id) {
          rpn[rpnLength++] = item;
          item.type = "operator";
          break;
        }
        rpn[rpnLength++] = item;
      }
      enclosure = --enclosureStackLength > 0
        ? enclosureStack[enclosureStackLength - 1]
        : null;
      break;

    case 6: // end
      for (; stackLength--;) {
        item = stack[stackLength];
        if (item.type === "enclosure_start") {
          report(
            `Invalid terminating token found ${item.value}.`,
            null,
            item.line,
            item.from,
            item.to
          );
          return null;
        }
        rpn[rpnLength++] = stack[stackLength];
      }
    }

    if (!ignored) {
      nodeBefore = node;
    }
    ignored = false;
  }

  return rpn;
}
