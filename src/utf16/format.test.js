import { expect } from 'chai';
import {
  codepoints2utf16,
  utf16inify
} from "./format";

describe("codepoint2utf16(codes)", () => {
  const sample = '\uD83D\uDCA9';
  const sampleCode = 128169;

  it("should create character from code points.", () => {
    const result = codepoints2utf16([sampleCode]);

    expect(result.text).to.equal(sample);
  });
});

describe("utf16inify(subject)", () => {
  const sample = '\uD83D\uDCA9';
  const sampleCode = 128169;

  it("should generate code points from string.", () => {
    const result = utf16inify(sample);

    expect(utf16inify(sample).text).to.equal(sample);
    expect(utf16inify(sampleCode).text).to.equal('128169');
  });
});