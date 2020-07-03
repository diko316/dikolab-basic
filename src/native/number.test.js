import { expect } from "chai";

import { number } from "./number";

describe("number()", () => {
  it("should return true if parameter is number.", () => {
    expect(number(1)).to.equal(true);
    expect(number(0xFF)).to.equal(true);
  });

  it("should return false if parameter is NaN or not a number.", () => {
    expect(number(NaN)).to.equal(false);
    expect(number(new Number(1))).to.equal(false);
    expect(number(Function)).to.equal(false);
  });
});