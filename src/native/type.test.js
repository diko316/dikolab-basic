import { expect } from "chai";

import {
  string
} from "./type";

describe("string()", () => {
  it("should return true if parameter is string.", () => {
    expect(string("string")).to.be.equal(true);
    expect(string(typeof 6)).to.be.equal(true);
  });

  it.only("should return false to non-string parameter.", () => {
    expect(string(6)).to.be.equal(false);
    expect(string(null)).to.be.equal(false);
    expect(string()).to.be.equal(false);
    expect(string(undefined)).to.be.equal(false);
  });
});
