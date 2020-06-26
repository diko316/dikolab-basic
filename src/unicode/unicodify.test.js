import { expect } from 'chai';
import { unicodify } from "./unicodify";

describe("unicodify(subject)", () => {
  const sample = '\uD83D\uDCA9';
  const sampleCode = 128169;

  it("should generate code points from string.", () => {
    const result = unicodify(sample);

    expect(unicodify(sample).text).to.equal(sample);
    expect(unicodify(sampleCode).text).to.equal('128169');
  });
});
