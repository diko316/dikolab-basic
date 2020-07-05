import { expect } from "chai";

import { each } from "./each";

describe("each(subject: any, callback: function)", () => {
  const emptyFn = function (){};
  const returnFalseFn = function () { return false };

  it("should return item index if subject parameter is iteratable.", () => {
    expect(each([0, 1], emptyFn)).to.equal(-1);
    expect(each([0, 1], returnFalseFn)).to.equal(0);
  });

  it("should return property if subject parameter is a valid Object.", () => {
    expect(each({ "name": "diko" }, emptyFn)).to.equal("");
    expect(each({ "name": "diko" }, returnFalseFn)).to.equal("name");
  });

  it("should return false if subject parameter is not iteratable or not valid Object.", () => {
    expect(each(null, emptyFn)).to.equal(false);
    expect(each(false, emptyFn)).to.equal(false);
    expect(each(true, emptyFn)).to.equal(false);
    expect(each(undefined, emptyFn)).to.equal(false);
    expect(each(1, emptyFn)).to.equal(false);
  });
});