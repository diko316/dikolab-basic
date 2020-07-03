import { expect } from "chai";

import { iteratable } from "./iteratable";

describe("iteratable()", () => {
  it("should return true if parameter is any object with .length property.", () => {
    expect(iteratable([])).to.equal(true);
    expect(iteratable("test")).to.equal(true);
    expect(iteratable(
      {
        length: 0
      }
    )).to.equal(true);
  });

  it("should return false if parameter is data without .length property.", () => {
    expect(iteratable(/test/)).to.equal(false);
    expect(iteratable(
      {
        
      }
    )).to.equal(false);
  });
});