import MANIFEST from "./parser-reference.json";

import { tokenize } from "./tokenizer";

const LINE_REGEXP = /\n/g;

let LAST_PARSE_ERRORS = null;

function reportParseError(error, subject, line, from, to) {
  let errors = LAST_PARSE_ERRORS;

  if (!errors) {
    LAST_PARSE_ERRORS = errors = [];
  }

  errors[errors.length] = error;
  console.log(error);
}

export function parse(subject) {
  const manifest = MANIFEST;
  const types = manifest.types;
  const reference = manifest.reference;
  const parseStack = [];
  const rpn = [];
  const tokens = [];
  const enclosureStack = [];
  let tokensLength = 0;
  let tokenIndex = 0;
  let parseStackLength = 0;
  let rpnLength = 0;
  let line = 1;
  let from = 0;
  let to = 0;
  let result = null;
  let token = null;
  let tokenValue = null;
  let definition = null;
  let node = null;
  let type = null;
  let lineMatch = LINE_REGEXP;
  let stackNode = null;
  let stackPrecedence = 0;
  let precedence = 0;
  let enclosureLength = 0;
  let enclosure = null;
  let ended = false;

  LAST_PARSE_ERRORS = null;

  result = tokenize(subject, tokenIndex);
  for (; result; result = tokenize(subject, tokenIndex)) {
    lineMatch = result[1].match(LINE_REGEXP);
    if (lineMatch) {
      line += lineMatch.length - 1;
    }
    tokens[tokensLength++] = result;
    result[3] = tokenIndex = result[2];
    result[4] = line;
  }

  /* eslint no-labels: 0 */
  loop: for (let c = 0, length = tokens.length; length--; c++) {
    result = tokens[c];
    token = result[0];
    tokenValue = result[1];
    from = result[2];
    to = result[3];

    if (!(token in reference)) {
      reportParseError(
        "Token has no definition",
        subject,
        line,
        from,
        to
      );
      return null;
    }

    definition = reference[token];
    type = types[definition[0]];

    node = {
      type,
      tokenId: token,
      token: tokenValue,
      from,
      to
    };

    switch (type) {
    case "operator":
      node.precedence = precedence = definition[1];
      node.operands = definition[2];
      node.leftAssociative = definition[3] === 2;

      // pop stack to rpn
      stackNode = parseStackLength ? parseStack[parseStackLength - 1] : null;
      while (stackNode && stackNode.type !== "enclosure_start") {
        stackPrecedence = stackNode.precedence;

        if (stackPrecedence > precedence ||
          (
            stackPrecedence === precedence &&
            node.leftAssociative
          )
        ) {
          rpn[rpnLength++] = stackNode;
          stackNode = parseStack[--parseStackLength];
        }
        break;
      }

      parseStack[parseStackLength++] = node;
      if (enclosureLength && enclosure.separator === node.tokenId) {
        enclosure.parameters++;
      }
      break;

    // push to stack
    case "operand":
      if (enclosureLength && !enclosure.parameters) {
        enclosure.parameters++;
      }
      rpn[rpnLength++] = node;
      break;

    case "enclosure_start":
      if (enclosureLength && !enclosure.parameters) {
        enclosure.parameters++;
      }
      node.ender = definition[1];
      node.production = definition[2];
      node.separator = definition[3];
      node.parameters = 0;
      parseStack[parseStackLength++] =
        enclosureStack[enclosureLength++] =
        enclosure = node;
      break;

    case "enclosure_end":
      stackNode = parseStackLength ? parseStack[parseStackLength - 1] : null;
      if (stackNode) {
        parseStackLength--;
      }

      while (stackNode) {
        ended = stackNode.type === "enclosure_start";
        if (ended && stackNode.ender !== node.tokenId) {
          reportParseError(
            "Invalid enclosure pair",
            subject,
            line,
            from,
            to
          );
          return null;
        }

        rpn[rpnLength++] = !ended ? stackNode
          : {
            type: "enclosure",
            tokenId: stackNode.tokenId,
            token: stackNode.production,
            from: stackNode.from,
            to: node.to,
            parameters: stackNode.parameters
          };

        if (ended) {
          enclosure = enclosureLength--
            ? enclosureStack[enclosureLength]
            : null;
          break;
        }

        if (!parseStackLength) {
          reportParseError(
            "Invalid enclosure pair",
            subject,
            line,
            from,
            to
          );
          return null;
        }
        stackNode = parseStack[--parseStackLength];
      }
      break;
    case "ignored": continue loop;
    }

    // console.log(token, ": ", type, ": ", definition);
  }

  parseStack.length = parseStackLength;

  console.log("rpn ", rpn);
  console.log("stack ", parseStack);
}
