import { expect } from "chai";
import { repeat } from "./repeat";

describe("String repeat(subject)", () => {
  it("should repeat string", () => {
    expect(repeat("5", 5)).to.be.equal("555555");
    expect(repeat("5", 1)).to.be.equal("55");
    expect(repeat("5", 0)).to.be.equal("5");
  });
});
