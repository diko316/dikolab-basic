import { expect } from "chai";

import { object } from "./object";

describe("object()", () => {
  it("should return true if parameter is an instance of Object.", () => {
    function customInstance() {
    }
    customInstance.prototype = {
      name: "customobject"
    };

    expect(object({})).to.equal(true);
    expect(object(
      new Object()
    )).to.equal(true);
    expect(object(
      new customInstance()
    )).to.equal(true);
  });

  it("should return false if parameter is an instance of native Javascript object except Object.", () => {
    expect(object(Function)).to.equal(false);
    expect(object(expect)).to.equal(false);
    expect(object(1)).to.equal(false);
    expect(object(Symbol("buang"))).to.equal(false);
    expect(object("buang")).to.equal(false);
    expect(object(BigInt(10))).to.equal(false);
    expect(object(/buang/)).to.equal(false);
  });

  it("should return false if parameter is undefined or null.", () => {
    expect(object(null)).to.equal(false);
    expect(object(undefined)).to.equal(false);
  });
});