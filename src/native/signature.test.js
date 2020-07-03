import { expect } from "chai";

import { signature } from "./signature";

describe("signature()", () => {
  it("should return \"[object Undefined]\" if parameter is undefined.", () => {
    expect(signature()).to.equal("[object Undefined]");
    expect(signature(undefined)).to.equal("[object Undefined]");
  });

  it("should return \"[object Null]\" if parameter is null.", () => {
    expect(signature(null)).to.equal("[object Null]");
  });

  it("should return data signature of object the same output as Object.prototype.toString.call(data).", () => {
    expect(signature("")).to.equal("[object String]");
    expect(signature(1)).to.equal("[object Number]");
    expect(signature(BigInt(1))).to.equal("[object BigInt]");
    expect(signature(Symbol("diko"))).to.equal("[object Symbol]");
    expect(signature(true)).to.equal("[object Boolean]");
    expect(signature(false)).to.equal("[object Boolean]");

    expect(signature({})).to.equal("[object Object]");
    expect(signature([])).to.equal("[object Array]");
    expect(signature(expect)).to.equal("[object Function]");
    expect(signature(/a/)).to.equal("[object RegExp]");
    expect(signature(new Date())).to.equal("[object Date]");
  });
});
