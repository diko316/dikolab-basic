import { expect } from "chai";

import { listPadStart } from "./list-pad-start";

describe("listPadStart()", () => {
  it("should return an Array padded from start of list with given length and pad list Array.", () => {
    expect(listPadStart([], 2, [0])).to.deep.equal([0, 0]);
    expect(listPadStart([1], 2, [0])).to.deep.equal([0, 1]);
    expect(listPadStart([1, 2, 3], 2, [0])).to.deep.equal([1, 2, 3]);
  });
});