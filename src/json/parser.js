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
  let definition = null;
  let index = 0;
  let id = null;
  let from = 0;
  let to = 0;
  let line = 1;
  let item = null;
  let precedence = 0;
  let symbolGen = 0;
  let alternatePrecedence = false;
  let context = null;
  let isExpectingOperand = true;
  let nodeType = null;
  let hasEnclosureArguments = false;

  for (token = tokenize(subject, index); token; token = tokenize(subject, index)) {
    id = token[0];
    from = index;
    index = to = token[2];
    line += token[3];
    token = token[1];

    definition = reference[id];
    alternatePrecedence = definition[3];
    precedence = definition[4];
    id = definition[1];
    context = definition[7] ? id : context;
    nodeType = nodeTypes[definition[0]];
    node = {
      id,
      type: nodeType,
      dataType: definition[6],
      symbol: `${id}${++symbolGen}`,
      context,
      value: token,
      operands: definition[2],
      precedence: alternatePrecedence ? precedence[0] : precedence,
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
      if (definition[3] && isExpectingOperand) {
        node.operands = 1;
        if (alternatePrecedence) {
          node.precedence = precedence[1];
        }
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
      // pop operators not expecting operands
      else {
        rpn[rpnLength++] = node;
      }
      break;

    case 2: // operand
      rpn[rpnLength++] = node;
      break;

    case 3: // start
      node.ender = definition[8];
      node.separator = definition[9];
      stack[stackLength++] = node;
      enclosureStack[enclosureStackLength++] = enclosure = node;
      break;

    case 4: // ender
      if (!enclosureStackLength) {
        report(
          `Invalid token found ${token}.`,
          line,
          from,
          to
        );
        return null;
      }

      if (enclosure.ender !== node.id) {
        report(
          `Invalid terminating token found ${token}.`,
          line,
          from,
          to
        );
        return null;
      }

      // append arguments
      if (hasEnclosureArguments) {
        enclosure.operands++;
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
            item.line,
            item.from,
            item.to
          );
          return null;
        }
        rpn[rpnLength++] = item;
      }
    }

    if (!ignored) {
      hasEnclosureArguments = true;
      isExpectingOperand = false;

      switch (nodeType) {
      case "enclosure_start":
        hasEnclosureArguments = false;

      // falls through
      case "operator":
      case "enclosure_separator":
        isExpectingOperand = true;
        break;
      }
    }
    ignored = false;
  }

  return rpn;
}
