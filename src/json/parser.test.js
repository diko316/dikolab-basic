import { expect } from "chai";
import { parse } from "./parser";
import {
  get,
  reset
} from "./error-reporting";

describe("parse()", () => {
  function output(infix) {
    const rpn = parse(infix);
    const output = [];
    if (rpn) {
      rpn.forEach(
        (item, index) => {
          output[index] = `${item.rule}|${item.value}:${item.operands}`;
        }
      );
      return output.join(",");
    }

    return null;
  }
  it.only("Should be able to parse negative/positive unary operation.", () => {
    reset();
    expect(output("-1")).to.be.equal("int|1:0,negative|-:1");
    expect(output("+2")).to.be.equal("int|2:0,positive|+:1");
    expect(output("+")).to.be.equal(null);
  });

  it.only("Should be able to parse binary operation.", () => {
    reset();
    expect(output("1 + 3 * 6")).to.be.equal(
      "int|1:0,int|3:0,int|6:0,mul|*:2,add|+:2"
    );
    expect(output("1 * 3 - 6")).to.be.equal(
      "int|1:0,int|3:0,mul|*:2,int|6:0,sub|-:2"
    );
    expect(output("1 > 3 - 6")).to.be.equal(
      "int|1:0,int|3:0,int|6:0,sub|-:2,gt|>:2"
    );
    expect(output("1 +")).to.be.equal(null);
  });

  it.only("Should be able to parse enclosures.", () => {
    reset();
    expect(output("(1 + 3) * 6")).to.be.equal(
      "int|1:0,int|3:0,add|+:2,int|6:0,mul|*:2"
    );
    expect(output("1 + (3 * 6)")).to.be.equal(
      "int|1:0,int|3:0,int|6:0,mul|*:2,add|+:2"
    );
    expect(output("1 + (3 * 6) - 2")).to.be.equal(
      "int|1:0,int|3:0,int|6:0,mul|*:2,add|+:2,int|2:0,sub|-:2"
    );
    expect(output(":test()")).to.be.equal(
      "call|test:0"
    );
    expect(output(":test(1)")).to.be.equal(
      "int|1:0,call|test:1"
    );
    expect(output("div:test()")).to.be.equal(
      "ident|div:0,call|test:1"
    );
    expect(output("div:test(1, 2)")).to.be.equal(
      "ident|div:0,int|1:0,int|2:0,call|test:3"
    );
  });
});
