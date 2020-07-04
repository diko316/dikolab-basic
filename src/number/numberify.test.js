import { expect } from "chai";

import { numberify } from "./numberify";

describe("numberify(subject: any)", () => {
  it("should return number presentation of string parameter.", () => {
    expect(numberify(".5")).to.be.equal(.5);
    expect(numberify("-.5")).to.be.equal(-0.5);
    expect(numberify("1.5e+100")).to.be.equal(1.5e100);
    expect(numberify("-1.")).to.be.equal(-1);

    expect(numberify("x.")).to.be.equal(0);
  });

  it("should return number of number parameter.", () => {
    expect(numberify(0xFF)).to.be.equal(0xFF);
    expect(numberify(BigInt(100))).to.be.equal(100);
  });

  it("should return 1 if parameter is boolean true.", () => {
    expect(numberify(true)).to.be.equal(1);
  });

  it("should return 0 if parameter is boolean false.", () => {
    expect(numberify(false)).to.be.equal(0);
  });

  it("should return number from default value if unable to resolve number from parameter.", () => {
    expect(numberify("x", 0xFF)).to.be.equal(0xFF);
    expect(numberify({}, BigInt(100))).to.be.equal(100);
  });
});
