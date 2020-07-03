import { expect } from "chai";

import { method } from "./method";

describe("method()", () => {
  it("should return true if parameter is a callable function.", () => {
    expect(method(expect)).to.equal(true);
    expect(method(method)).to.equal(true);
    expect(method(
      new Function()
    )).to.equal(true);
    expect(method(
      function test() {
        
      }
    )).to.equal(true);
    expect(method([])).to.equal(false);
  });
});