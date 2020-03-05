import { expect } from 'chai';
import {
  fromCodePoint,
  toCodePoints
} from "./utf16";

describe("fromCodePoint(codes)", () => {
  const sample = '\uD83D\uDCA9';
  const sampleCode = 128169;

  it("should create character from code points.", () => {
    const result = fromCodePoint([sampleCode]);

    expect(result).to.equal(sample);
  });
});

describe("toCodePoints(subject)", () => {
  const sample = '\uD83D\uDCA9';
  const sampleCode = 128169;

  it("should generate code points from string.", () => {
    const result = toCodePoints(sample);

    expect(result).to.be.an("Array");
    expect(result[0]).to.equal(sampleCode);
  });
});