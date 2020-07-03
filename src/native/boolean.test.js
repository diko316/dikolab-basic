import { expect } from "chai";

import { boolean } from "./boolean";

describe("boolean()", () => {
  it("should return true if parameter is boolean.", () => {
    expect(boolean(true)).to.equal(true);
    expect(boolean(false)).to.equal(true);
    expect(boolean(null)).to.equal(false);
    expect(boolean(undefined)).to.equal(false);
  });
});