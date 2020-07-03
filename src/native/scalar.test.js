import { expect } from "chai";

import { scalar } from "./scalar";

describe("scalar()", () => {
  it("should return true if parameter is string.", () => {
    expect(scalar("")).to.equal(true);
    expect(scalar("ab")).to.equal(true);
  });

  it("should return true if parameter is number.", () => {
    expect(scalar(1)).to.equal(true);
    expect(scalar(0xFF)).to.equal(true);
  });

  it("should return true if parameter is boolean.", () => {
    expect(scalar(true)).to.equal(true);
    expect(scalar(false)).to.equal(true);
  });

  it("should return true if parameter is bigint.", () => {
    expect(scalar(BigInt(10))).to.equal(true);
  });

  it("should return true if parameter is symbol.", () => {
    expect(scalar(Symbol("diko"))).to.equal(true);
  });
});
