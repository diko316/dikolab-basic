import { expect } from "chai";
import { trimStart } from "./trim-start";

describe("String trimStart(subject)", () => {
  it("should trimStart string", () => {
    expect(trimStart(" buang ")).to.be.equal("buang ");
    expect(trimStart("buang")).to.be.equal("buang");
    expect(trimStart("   buang\t\r\n")).to.be.equal("buang\t\r\n");
  });
});
