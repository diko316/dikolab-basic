import { expect } from "chai";

import { unicodeCount } from "./unicode-count";

describe("codePointToString(...number)", () => {
  it("should return string from code point parameter/s.", () => {
    const stringSample = "he\uD83D\uDCA9re";
    const stringSample1 = "\uD83D\uDCA9here";
    const stringSample2 = "here\uD83D\uDCA9";

    expect(unicodeCount(stringSample)).to.equal(5);
    expect(unicodeCount(stringSample1)).to.equal(5);
    expect(unicodeCount(stringSample2)).to.equal(5);
  });
});