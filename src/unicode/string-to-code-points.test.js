import { expect } from "chai";

import { stringToCodePoints } from "./string-to-code-points";

describe("stringToCodePoints(string)", () => {
  it("should return Array with code points from string parameter.", () => {
    const stringSample = "he\uD83D\uDCA9re";
    const stringSample1 = "\uD83D\uDCA9here";
    const stringSample2 = "here\uD83D\uDCA9";

    expect(stringToCodePoints(stringSample)).to.deep.equal([104, 101, 128169, 114, 101]);
    expect(stringToCodePoints(stringSample1)).to.deep.equal([128169, 104, 101, 114, 101]);
    expect(stringToCodePoints(stringSample2)).to.deep.equal([104, 101, 114, 101, 128169]);
  });
});