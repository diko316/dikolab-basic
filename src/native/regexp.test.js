import { expect } from "chai";

import { regexp } from "./regexp";

describe("regexp()", () => {
  it("should return true if parameter is an instance of RegExp.", () => {
    expect(regexp(/a/)).to.equal(true);
    expect(regexp(new RegExp("ab"))).to.equal(true);
  });

  it("should return false if parameter is not a thenable object.", () => {
    expect(regexp({})).to.equal(false);
    expect(regexp(1)).to.equal(false);
    expect(regexp("then")).to.equal(false);
  });
});
