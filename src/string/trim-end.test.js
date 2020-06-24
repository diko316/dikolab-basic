import { expect } from "chai";
import { trimEnd } from "./trim-end";

describe("String trimEnd(subject)", () => {
  it("should trimEnd string", () => {
    expect(trimEnd(" buang ")).to.be.equal(" buang");
    expect(trimEnd("buang")).to.be.equal("buang");
    expect(trimEnd("   buang\t\r\n")).to.be.equal("   buang");
  });
});
