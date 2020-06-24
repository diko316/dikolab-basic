import { expect } from "chai";
import { trim } from "./trim";

describe("String trim(subject)", () => {
  it("Should trim string", () => {
    expect(trim(" buang  ")).to.be.equal("buang");
    expect(trim("buang")).to.be.equal("buang");
    expect(trim("   buang\t\r\n")).to.be.equal("buang");
  });
});
