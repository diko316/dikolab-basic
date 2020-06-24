import { expect } from "chai";
import { stringify } from "./stringify";

describe("String stringify(subject)", () => {
  it("should repeat string", () => {
    const date = new Date();
    expect(stringify(5)).to.be.equal("5");
    expect(stringify(true)).to.be.equal("true");
    expect(stringify(date)).to.be.equal("");
  });
});
