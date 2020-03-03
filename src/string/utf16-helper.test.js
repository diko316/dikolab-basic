import { expect } from 'chai';
import {
  points2string,
  string2points
} from "./utf16-helper";

describe("points2string(codes)", () => {
  const sample = '\uD83D\uDCA9';
  const sampleCode = 128169;

  it("should create character from code points.", () => {
    const result = points2string([sampleCode]);

    expect(result).to.equal(sample);
  });
});

describe("string2points(subject)", () => {
  const sample = '\uD83D\uDCA9';
  const sampleCode = 128169;

  it("should generate code points from string.", () => {
    const result = string2points(sample);

    expect(result).to.be.an("Array");
    expect(result[0]).to.equal(sampleCode);
  });
});