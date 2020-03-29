import { parse } from "./parser";

import { reportParseError } from "./error-reporting";

import {
  initializeOperand,
  initializeGet
} from "./compile/initialize";

import {
  access
} from "./compile/object";

import {
  add,
  sub,
  mul
} from "./compile/arithmetic";

export function compile(subject) {
  const rpn = parse(subject);
  const report = reportParseError;
  const code = [];
  const symbols = [];
  const stack = [];
  let stackLength = 0;
  let node = 0;
  let type = null;
  let context = null;
  let nodeId = null;
  let operands = null;

  // dont if no rpn created
  if (!rpn) {
    return null;
  }

  const output = [];
  rpn.forEach(
    (item, index) => {
      output[index] = item.value;
    }
  );
  console.log(output.join(" "));

  // generate source code
  for (let c = 0, length = rpn.length; length--; c++) {
    node = rpn[c];
    type = node.type;

    // operands
    if (type === "operand") {
      node.augmented = false;
      stack[stackLength++] = node;
      initializeOperand(node, code, symbols, context);
      console.log("stack push ", node.value, " length: ", stackLength);
      continue;
    }

    operands = node.operands;

    if (stackLength < operands) {
      report(
        `Low on operands ${node.value}`,
        null,
        node.line,
        node.from,
        node.to
      );
      console.log(
        code.join("\r\n")
      );
      return null;
    }
    node.augmented = true;
    nodeId = node.id;
    stackLength -= operands;
    operands = stack.slice(stackLength, stackLength + operands);

    switch (nodeId) {
    case "get":
      context = nodeId;
      initializeGet(node, code, symbols, context);
      break;

    case "add":
      add(node, code, symbols, operands);
      stack[stackLength++] = node;
      console.log("stack pushed result ", node.value, " length: ", stackLength);
      break;

    case "sub":
      sub(node, code, symbols, operands);
      stack[stackLength++] = node;
      console.log("stack pushed result ", node.value, " length: ", stackLength);
      break;

    case "mul":
      mul(node, code, symbols, operands);
      stack[stackLength++] = node;
      console.log("stack pushed result ", node.value, " length: ", stackLength);
      break;

    case "access":
      access(node, code, symbols, operands, context);
      stack[stackLength++] = node;
      break;
    default:
      console.log("unprocessed ", node);
    }

    // console.log(
    //   "id", nodeId,
    //   "operands", operands,
    //   "stack", stack.slice(0, stackLength)
    // );
  }

  console.log(
    code.join("\r\n")
  );
}
