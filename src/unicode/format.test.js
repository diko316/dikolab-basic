import { expect } from 'chai';
import {
  codepoints2Utf,
  unicodify
} from "./format";

describe("codepoints2Utf(codes)", () => {
  const sample = '\uD83D\uDCA9';
  const sampleCode = 128169;

  it("should create character from code points.", () => {
    const result = codepoints2Utf([sampleCode]);

    expect(result.text).to.equal(sample);
  });
});

describe("unicodify(subject)", () => {
  const sample = '\uD83D\uDCA9';
  const sampleCode = 128169;

  it("should generate code points from string.", () => {
    const result = unicodify(sample);

    expect(unicodify(sample).text).to.equal(sample);
    expect(unicodify(sampleCode).text).to.equal('128169');
  });
});