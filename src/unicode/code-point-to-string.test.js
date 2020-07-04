import { expect } from "chai";

import { codePointToString } from "./code-point-to-string";

describe("codePointToString(...number)", () => {
  it("should return string from code point parameter/s.", () => {
    const stringSample = "he\uD83D\uDCA9re";
    const stringSample1 = "\uD83D\uDCA9here";
    const stringSample2 = "here\uD83D\uDCA9";

    expect(
      codePointToString(104, 101, 128169, 114, 101)
    ).to.equal(stringSample);

    expect(
      codePointToString(128169, 104, 101, 114, 101)
    ).to.equal(stringSample1);

    expect(
      codePointToString(104, 101, 114, 101, 128169)
    ).to.equal(stringSample2);
  });
});