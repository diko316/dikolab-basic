import { expect } from "chai";
import { padEnd } from "./pad-end";


describe("String padEnd(subject, length [, padString])", () => {
  it("should pad from end of string", () => {
    expect(padEnd("buang", 6, " ")).to.be.equal("buang ");
    expect(padEnd("buang", 7, "exec")).to.be.equal("buangex");
  });
});
