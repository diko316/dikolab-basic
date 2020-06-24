import { expect } from "chai";
import { quoteEscape } from "./quote-escape";

describe("String quoteEscape(subject)", () => {
  it("should quote string", () => {
    expect(quoteEscape("'\\'diko\"")).to.equal("''diko\\\"");
  });
});
