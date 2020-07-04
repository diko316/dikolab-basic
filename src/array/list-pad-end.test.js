import { expect } from "chai";

import { listPadEnd } from "./list-pad-end";

describe("listPadEnd()", () => {
  it("should return an Array padded from end of list with given length and pad list Array.", () => {
    expect(listPadEnd([], 2, [0])).to.deep.equal([0, 0]);
    expect(listPadEnd([1], 2, [0])).to.deep.equal([1, 0]);
    expect(listPadEnd([1, 2, 3], 2, [0])).to.deep.equal([1, 2, 3]);
  });
});