import { parse } from "./parser";

import { reportCompileError } from "./error-reporting";

import {
  preprocess,
  postprocess
} from "./compile/initialize";

import {
  operand
} from "./compile/operand";

import {
  access
} from "./compile/object";

import {
  arithmetic
} from "./compile/arithmetic";

import {
  condition
} from "./compile/condition";

import {
  get
} from "./compile/query";

export function compile(subject) {
  const rpn = parse(subject);
  const report = reportCompileError;
  const code = [];
  const symbols = [];
  const stack = [];
  let stackLength = 0;
  let node = 0;
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

  preprocess(code);

  // generate source code
  for (let c = 0, length = rpn.length; length--; c++) {
    node = rpn[c];

    // operands
    if (node.type === "operand") {
      node.augmented = false;
      operand(node, code, symbols);
      stack[stackLength++] = node;
      continue;
    }

    operands = node.operands;

    if (stackLength < operands) {
      report(
        `Low on operands ${node.value}`,
        node
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
    node.operands = operands;

    switch (nodeId) {
    case "get":
      get(node, code, symbols);
      break;

    case "add":
    case "sub":
    case "mul":
    case "div":
    case "mod":
      arithmetic(node, code, symbols);
      stack[stackLength++] = node;
      break;

    case "eq":
    case "neq":
    case "gt":
    case "gte":
    case "lt":
    case "lte":
    case "pattern":
      condition(node, code);
      stack[stackLength++] = node;
      break;

    case "access":
      access(node, code, symbols);
      stack[stackLength++] = node;
      break;

    case "list":
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

  postprocess(code, symbols);

  console.log(
    code.join("\r\n")
  );
}
