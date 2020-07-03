import { expect } from "chai";

import { numeric } from "./numeric";

describe("numeric()", () => {
  it("should return true if parameter is number.", () => {
    expect(numeric(1)).to.equal(true);
    expect(numeric(0xFF)).to.equal(true);
  });

  it("should return true if parameter is a string presentation of number.", () => {
    expect(numeric("1.0")).to.equal(true);
    expect(numeric("0.1")).to.equal(true);
    expect(numeric("0.1e-1")).to.equal(true);
    expect(numeric("+0.1e-1")).to.equal(true);
  });

  it("should return false if parameter is a bigint number.", () => {
    expect(numeric(BigInt(10))).to.equal(false);
  });

  it("should return false if parameter is NaN or not a number.", () => {
    expect(numeric(NaN)).to.equal(false);
    expect(numeric(new Number(1))).to.equal(false);
    expect(numeric(Function)).to.equal(false);
  });
});