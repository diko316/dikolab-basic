// import { expect } from "chai";
import { parse } from "./parser";

describe("parse()", () => {
  it.only("Should be able to parse.", () => {
    const infix = "-1 + 2 + -3)";
    const rpn = parse(infix);
    const output = [];

    rpn.forEach(
      (item, index) => {
        output[index] = `${item.value}|${item.operands}`;
      }
    );
    console.log("infix: ", infix);
    console.log("rpn: ", output.join(", "));
  });
});
