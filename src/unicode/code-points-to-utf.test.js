import { expect } from 'chai';
import { codePointsToUtf } from "./code-points-to-utf";

describe("codePointsToUtf(codes)", () => {
  const sample = '\uD83D\uDCA9';
  const sampleCode = 128169;

  it("should create character from code points.", () => {
    const result = codePointsToUtf([sampleCode]);

    expect(result.text).to.equal(sample);
  });
});