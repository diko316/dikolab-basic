import { expect } from "chai";

import { array } from "./array";

describe("array()", () => {
  it("should return true if parameter is array.", () => {
    const test = {
      length: 0
    };
    expect(array([])).to.equal(true);
    expect(array(test)).to.equal(false);
  });
});