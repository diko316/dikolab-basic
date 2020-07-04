import { expect } from "chai";

import { symbol } from "./symbol";

describe("symbol()", () => {
  it("should return true if parameter is symbol.", () => {
    expect(symbol(Symbol("diko"))).to.be.equal(true);
    expect(symbol("string")).to.be.equal(false);
    expect(symbol(typeof 6)).to.be.equal(false);
  });
});
