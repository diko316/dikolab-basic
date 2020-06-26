import { expect } from "chai";
import { padStart } from "./pad-start";

describe("String padStart(subject, length [, padString])", () => {
  it("should pad from start of string", () => {
    expect(padStart("buang", 6, " ")).to.be.equal(" buang");
    expect(padStart("buang", 7, "bass")).to.be.equal("babuang");
  });
});
